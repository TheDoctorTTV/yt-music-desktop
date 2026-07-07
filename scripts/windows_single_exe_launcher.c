#define WIN32_LEAN_AND_MEAN

#include <stdbool.h>
#include <stdio.h>
#include <windows.h>

#define IDR_LAUFEY_WEBVIEW_EXE 101
#define IDR_APP_DLL 102
#define IDR_APP_BAT 103
#define IDR_DENO_DESKTOP_MARKER 104
#define IDR_DOWNLOADED_MARKER 105

static void show_last_error(const wchar_t* context) {
  DWORD error = GetLastError();
  wchar_t message[1024];

  swprintf(message, 1024, L"%ls\n\nWindows error: %lu", context, error);
  MessageBoxW(NULL, message, L"YouTube Music Desktop", MB_ICONERROR | MB_OK);
}

static bool ensure_directory(const wchar_t* path) {
  if (CreateDirectoryW(path, NULL)) {
    return true;
  }

  return GetLastError() == ERROR_ALREADY_EXISTS;
}

static bool get_runtime_directory(wchar_t* output, size_t output_length) {
  wchar_t temp_path[MAX_PATH];
  wchar_t module_path[MAX_PATH];
  WIN32_FILE_ATTRIBUTE_DATA module_info;

  if (GetTempPathW(MAX_PATH, temp_path) == 0) {
    show_last_error(L"Could not find the Windows temporary directory.");
    return false;
  }

  if (GetModuleFileNameW(NULL, module_path, MAX_PATH) == 0) {
    show_last_error(L"Could not find the launcher path.");
    return false;
  }

  if (!GetFileAttributesExW(module_path, GetFileExInfoStandard, &module_info)) {
    show_last_error(L"Could not inspect the launcher file.");
    return false;
  }

  int written = swprintf(
    output,
    output_length,
    L"%lsytmusicdesktop-%08lx%08lx-%08lx",
    temp_path,
    module_info.ftLastWriteTime.dwHighDateTime,
    module_info.ftLastWriteTime.dwLowDateTime,
    module_info.nFileSizeLow
  );

  if (written < 0 || (size_t) written >= output_length) {
    MessageBoxW(
      NULL,
      L"The runtime directory path is too long.",
      L"YouTube Music Desktop",
      MB_ICONERROR | MB_OK
    );
    return false;
  }

  if (!ensure_directory(output)) {
    show_last_error(L"Could not create the runtime directory.");
    return false;
  }

  return true;
}

static bool join_path(
  const wchar_t* directory,
  const wchar_t* filename,
  wchar_t* output,
  size_t output_length
) {
  int written = swprintf(output, output_length, L"%ls\\%ls", directory, filename);

  if (written < 0 || (size_t) written >= output_length) {
    MessageBoxW(
      NULL,
      L"A bundled file path is too long.",
      L"YouTube Music Desktop",
      MB_ICONERROR | MB_OK
    );
    return false;
  }

  return true;
}

static bool write_resource(int resource_id, const wchar_t* output_path) {
  HRSRC resource = FindResourceW(NULL, MAKEINTRESOURCEW(resource_id), RT_RCDATA);

  if (resource == NULL) {
    show_last_error(L"Could not find a bundled runtime file.");
    return false;
  }

  HGLOBAL loaded_resource = LoadResource(NULL, resource);
  DWORD resource_size = SizeofResource(NULL, resource);
  void* resource_data = LockResource(loaded_resource);

  if (loaded_resource == NULL || resource_size == 0 || resource_data == NULL) {
    show_last_error(L"Could not read a bundled runtime file.");
    return false;
  }

  HANDLE file = CreateFileW(
    output_path,
    GENERIC_WRITE,
    0,
    NULL,
    CREATE_ALWAYS,
    FILE_ATTRIBUTE_NORMAL,
    NULL
  );

  if (file == INVALID_HANDLE_VALUE) {
    if (GetFileAttributesW(output_path) != INVALID_FILE_ATTRIBUTES) {
      return true;
    }

    show_last_error(L"Could not write a bundled runtime file.");
    return false;
  }

  DWORD bytes_written = 0;
  bool ok = WriteFile(file, resource_data, resource_size, &bytes_written, NULL) &&
    bytes_written == resource_size;

  CloseHandle(file);

  if (!ok) {
    show_last_error(L"Could not finish writing a bundled runtime file.");
  }

  return ok;
}

static bool extract_resource(
  int resource_id,
  const wchar_t* runtime_directory,
  const wchar_t* filename,
  wchar_t* output_path,
  size_t output_path_length
) {
  if (!join_path(runtime_directory, filename, output_path, output_path_length)) {
    return false;
  }

  return write_resource(resource_id, output_path);
}

static bool launch_app(const wchar_t* runtime_directory, const wchar_t* app_exe, const wchar_t* app_dll) {
  wchar_t command_line[MAX_PATH * 4];
  STARTUPINFOW startup_info;
  PROCESS_INFORMATION process_info;

  int written = swprintf(
    command_line,
    MAX_PATH * 4,
    L"\"%ls\" --runtime \"%ls\"",
    app_exe,
    app_dll
  );

  if (written < 0 || written >= MAX_PATH * 4) {
    MessageBoxW(
      NULL,
      L"The app launch command is too long.",
      L"YouTube Music Desktop",
      MB_ICONERROR | MB_OK
    );
    return false;
  }

  ZeroMemory(&startup_info, sizeof(startup_info));
  ZeroMemory(&process_info, sizeof(process_info));
  startup_info.cb = sizeof(startup_info);

  if (!CreateProcessW(
    app_exe,
    command_line,
    NULL,
    NULL,
    FALSE,
    0,
    NULL,
    runtime_directory,
    &startup_info,
    &process_info
  )) {
    show_last_error(L"Could not start YouTube Music Desktop.");
    return false;
  }

  CloseHandle(process_info.hThread);
  CloseHandle(process_info.hProcess);

  return true;
}

int WINAPI wWinMain(HINSTANCE instance, HINSTANCE previous_instance, PWSTR command_line, int show_command) {
  (void) instance;
  (void) previous_instance;
  (void) command_line;
  (void) show_command;

  wchar_t runtime_directory[MAX_PATH];
  wchar_t app_exe[MAX_PATH];
  wchar_t app_dll[MAX_PATH];
  wchar_t unused_path[MAX_PATH];

  if (!get_runtime_directory(runtime_directory, MAX_PATH)) {
    return 1;
  }

  if (
    !extract_resource(
      IDR_LAUFEY_WEBVIEW_EXE,
      runtime_directory,
      L"laufey_webview.exe",
      app_exe,
      MAX_PATH
    ) ||
    !extract_resource(
      IDR_APP_DLL,
      runtime_directory,
      L"youtube-music-desktop.dll",
      app_dll,
      MAX_PATH
    ) ||
    !extract_resource(
      IDR_APP_BAT,
      runtime_directory,
      L"youtube-music-desktop.bat",
      unused_path,
      MAX_PATH
    ) ||
    !extract_resource(
      IDR_DENO_DESKTOP_MARKER,
      runtime_directory,
      L".deno-desktop-app",
      unused_path,
      MAX_PATH
    ) ||
    !extract_resource(
      IDR_DOWNLOADED_MARKER,
      runtime_directory,
      L".downloaded",
      unused_path,
      MAX_PATH
    )
  ) {
    return 1;
  }

  return launch_app(runtime_directory, app_exe, app_dll) ? 0 : 1;
}
