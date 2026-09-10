# Releasing 1.0.0 and publishing to AUR

AUR stores build recipes, **not** the `.pkg.tar.zst` binary. Users download the
source for a fixed release tag and build it against their system Qt packages.
`packaging/arch/PKGBUILD` is for local snapshots; the separate AUR template in
`packaging/aur/PKGBUILD.in` downloads the public GitHub tag and verifies its SHA-256.

## Before tagging

- Review and commit the release changes, including `CHANGELOG.md`.
- The project currently has no declared license. Choose the project's license,
  add its LICENSE file, and update both Arch recipes before publication. Do not
  label it MIT/GPL/etc. without choosing those terms. If a license file must be
  installed, include it in the local source snapshot and CMake install rules.
- Confirm `CMakeLists.txt` and `packaging/arch/PKGBUILD` both say `1.0.0`.
- Build the two release artifacts with `./build.sh all` when ready. The command
  does not install or run the application. Older artifacts in `dist/` retain
  their old version until rebuilt.

## Publish the source release

After committing the release changes on your intended release branch:

```sh
git push
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0
```

Create a GitHub release for `v1.0.0`, use the 1.0.0 entry from `CHANGELOG.md` as
its release notes, and attach:

- `dist/qt/youtube-music-desktop.AppImage`
- `dist/arch/yt-music-desktop-1.0.0-1-x86_64.pkg.tar.zst`

The tag must include the new Qt source and CMake files. Merely committing them
locally does not make them downloadable. Do not move a published tag to a
new commit; publish a new version for source changes.

## Prepare AUR files

Once the public tag exists, run from this project:

```sh
./scripts/prepare_aur.sh
```

This downloads the real tagged archive, computes its checksum, and generates:

- `dist/aur/PKGBUILD`
- `dist/aur/.SRCINFO`

No checksum is guessed in advance. These files cannot be finalized until the tag
is public. The generated recipe builds from source; it is not a `-bin` package.
Review the recipe, license metadata and generated `.SRCINFO` before submission.
An optional local package build is `cd dist/aur && makepkg -s`; a clean Arch
build environment is preferable for checking release dependencies.

## Submit to AUR

The AUR package name is **`yt-music-desktop`**, matching this repository. On
2026-09-10, the AUR RPC reported this name available; `youtube-music-desktop`
is already maintained for an unrelated qtws application. The AUR recipe
conflicts with and replaces this project's earlier local packages named
`youtube-music-desktop`. When switching, pacman removes the old package and
installs this one; the executable remains `youtube-music-desktop` and the
profile is unchanged.

1. Create an account at <https://aur.archlinux.org/> and add your SSH **public**
   key in the account settings. Keep the private key private.
2. Search AUR for `yt-music-desktop` and verify the name is available. If
   it already exists, inspect its upstream project and maintainer; do not submit
   an unrelated project over an existing package. Adjust the recipe/name if
   necessary before generating metadata.
3. Clone the separate AUR repository (an empty repository is expected for a new
   name):

```sh
git -c init.defaultBranch=master clone \
  ssh://aur@aur.archlinux.org/yt-music-desktop.git \
  "$HOME/yt-music-desktop-aur"
```

4. Copy **only** the generated recipe and metadata into that repository:

```sh
cp /home/thedoctorttv/Documents/GitHub/yt-music-desktop/dist/aur/PKGBUILD \
   /home/thedoctorttv/Documents/GitHub/yt-music-desktop/dist/aur/.SRCINFO \
   "$HOME/yt-music-desktop-aur/"
cd "$HOME/yt-music-desktop-aur"
git add PKGBUILD .SRCINFO
git commit -m "Initial release: yt-music-desktop 1.0.0"
git push -u origin master
```

The first successful push publishes the package. Do not upload the application
repository, source archives, AppImage, built Arch package or `src/`/`pkg/` build
directories into the AUR Git repository.

For later versions, bump `pkgver`, reset `pkgrel` to 1, publish the matching tag,
regenerate the source checksum and `.SRCINFO`, and commit/push those changes to
AUR. Increment `pkgrel` for packaging-only changes to the same source release.

References: [AUR submission guidelines](https://wiki.archlinux.org/title/AUR_submission_guidelines),
[.SRCINFO](https://wiki.archlinux.org/title/.SRCINFO),
[Arch User Repository](https://wiki.archlinux.org/title/Arch_User_Repository).
