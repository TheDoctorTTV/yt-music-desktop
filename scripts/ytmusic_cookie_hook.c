#define _GNU_SOURCE

#include <dlfcn.h>
#include <limits.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/stat.h>

typedef void* (*web_view_new_with_user_content_manager_fn)(void*);
typedef void* (*web_view_get_context_fn)(void*);
typedef void* (*web_context_get_cookie_manager_fn)(void*);
typedef void (*cookie_manager_set_persistent_storage_fn)(void*, const char*, int);
typedef void (*cookie_manager_set_accept_policy_fn)(void*, int);

static int configured = 0;

static void mkdir_if_missing(const char* path) {
  if (mkdir(path, 0700) != 0) {
    return;
  }
}

static void ensure_profile_dirs(const char* profile_dir) {
  char data_dir[PATH_MAX];

  mkdir_if_missing(profile_dir);

  if (snprintf(data_dir, sizeof(data_dir), "%s/data", profile_dir) > 0) {
    mkdir_if_missing(data_dir);
  }
}

static int cookie_path(char* output, size_t output_size) {
  const char* profile_dir = getenv("YTMUSIC_PROFILE_DIR");
  char fallback[PATH_MAX];

  if (profile_dir == NULL || profile_dir[0] == '\0') {
    const char* state_home = getenv("XDG_STATE_HOME");
    const char* home = getenv("HOME");

    if (state_home != NULL && state_home[0] != '\0') {
      snprintf(
        fallback,
        sizeof(fallback),
        "%s/net.thedoctorttv.ytmusicdesktop",
        state_home
      );
    } else if (home != NULL && home[0] != '\0') {
      snprintf(
        fallback,
        sizeof(fallback),
        "%s/.local/state/net.thedoctorttv.ytmusicdesktop",
        home
      );
    } else {
      return 0;
    }

    profile_dir = fallback;
  }

  ensure_profile_dirs(profile_dir);

  return snprintf(output, output_size, "%s/data/cookies.sqlite", profile_dir) > 0;
}

static void configure_cookie_storage(void* web_view) {
  char path[PATH_MAX];

  if (configured || web_view == NULL || !cookie_path(path, sizeof(path))) {
    return;
  }

  web_view_get_context_fn webkit_web_view_get_context =
    (web_view_get_context_fn) dlsym(RTLD_NEXT, "webkit_web_view_get_context");
  web_context_get_cookie_manager_fn webkit_web_context_get_cookie_manager =
    (web_context_get_cookie_manager_fn) dlsym(
      RTLD_NEXT,
      "webkit_web_context_get_cookie_manager"
    );
  cookie_manager_set_persistent_storage_fn webkit_cookie_manager_set_persistent_storage =
    (cookie_manager_set_persistent_storage_fn) dlsym(
      RTLD_NEXT,
      "webkit_cookie_manager_set_persistent_storage"
    );
  cookie_manager_set_accept_policy_fn webkit_cookie_manager_set_accept_policy =
    (cookie_manager_set_accept_policy_fn) dlsym(
      RTLD_NEXT,
      "webkit_cookie_manager_set_accept_policy"
    );

  if (
    webkit_web_view_get_context == NULL ||
    webkit_web_context_get_cookie_manager == NULL ||
    webkit_cookie_manager_set_persistent_storage == NULL
  ) {
    return;
  }

  void* context = webkit_web_view_get_context(web_view);
  void* cookie_manager = webkit_web_context_get_cookie_manager(context);

  if (cookie_manager == NULL) {
    return;
  }

  webkit_cookie_manager_set_persistent_storage(cookie_manager, path, 1);

  if (webkit_cookie_manager_set_accept_policy != NULL) {
    webkit_cookie_manager_set_accept_policy(cookie_manager, 0);
  }

  configured = 1;
}

void* webkit_web_view_new_with_user_content_manager(void* user_content_manager) {
  web_view_new_with_user_content_manager_fn original =
    (web_view_new_with_user_content_manager_fn) dlsym(
      RTLD_NEXT,
      "webkit_web_view_new_with_user_content_manager"
    );

  if (original == NULL) {
    return NULL;
  }

  void* web_view = original(user_content_manager);
  configure_cookie_storage(web_view);

  return web_view;
}
