#!/usr/bin/env bash
# Copyright 2019-2022 Tauri Programme within The Commons Conservancy
# SPDX-License-Identifier: Apache-2.0
# SPDX-License-Identifier: MIT

set -euxo pipefail

export ARCH=x86_64
APPIMAGE_BUNDLE_XDG_OPEN=${APPIMAGE_BUNDLE_XDG_OPEN-0}
APPIMAGE_BUNDLE_GSTREAMER=${APPIMAGE_BUNDLE_GSTREAMER-0}
TRAY_LIBRARY_PATH=${TRAY_LIBRARY_PATH-0}

if [ "$ARCH" == "i686" ]; then
    linuxdeploy_arch="i386"
else
    linuxdeploy_arch="$ARCH"
fi

mkdir -p "pctrl.AppDir"
cp -r ../appimage_deb/data/usr "pctrl.AppDir"

cd "pctrl.AppDir"
mkdir -p "usr/bin"
mkdir -p "usr/lib"

if [[ "$APPIMAGE_BUNDLE_XDG_OPEN" != "0" ]] && [[ -f "/usr/bin/xdg-open" ]]; then
  echo "Copying /usr/bin/xdg-open"
  cp /usr/bin/xdg-open usr/bin
fi

if [[ "$TRAY_LIBRARY_PATH" != "0" ]]; then
  echo "Copying appindicator library ${TRAY_LIBRARY_PATH}"
  cp ${TRAY_LIBRARY_PATH} usr/lib
  # It looks like we're practicing good hygiene by adding the ABI version.
  # But for compatibility we'll symlink this file to what we did before.
  # Specifically this prevents breaking libappindicator-sys v0.7.1 and v0.7.2.
  if [[ "$TRAY_LIBRARY_PATH" == *.so.1 ]]; then
    readonly soname=$(basename "$TRAY_LIBRARY_PATH")
    readonly old_name=$(basename "$TRAY_LIBRARY_PATH" .1)
    echo "Adding compatibility symlink ${old_name} -> ${soname}"
    ln -s ${soname} usr/lib/${old_name}
  fi
fi

# Copy WebKit files.
find /usr/lib* -name WebKitNetworkProcess -exec mkdir -p "$(dirname '{}')" \; -exec cp --parents '{}' "." \; || true
find /usr/lib* -name WebKitWebProcess -exec mkdir -p "$(dirname '{}')" \; -exec cp --parents '{}' "." \; || true
find /usr/lib* -name libwebkit2gtkinjectedbundle.so -exec mkdir -p "$(dirname '{}')" \; -exec cp --parents '{}' "." \; || true

( cd "/home/mohamedsherif/.cache/tauri" && ( wget -q -4 -N https://github.com/AppImage/AppImageKit/releases/download/continuous/AppRun-${ARCH} || wget -q -4 -N https://github.com/AppImage/AppImageKit/releases/download/12/AppRun-${ARCH} ) )
chmod +x "/home/mohamedsherif/.cache/tauri/AppRun-${ARCH}"

# We need AppRun to be installed as pctrl.AppDir/AppRun.
# Otherwise the linuxdeploy scripts will default to symlinking our main bin instead and will crash on trying to launch.
cp "/home/mohamedsherif/.cache/tauri/AppRun-${ARCH}" AppRun

cp "usr/share/icons/hicolor/256x256@2/apps/pctrl.png" .DirIcon
ln -s "usr/share/icons/hicolor/256x256@2/apps/pctrl.png" "pctrl.png"

ln -s "usr/share/applications/pctrl.desktop" "pctrl.desktop"

cd ..

if [[ "$APPIMAGE_BUNDLE_GSTREAMER" != "0" ]]; then
  gst_plugin="--plugin gstreamer"
  wget -q -4 -N "https://raw.githubusercontent.com/tauri-apps/linuxdeploy-plugin-gstreamer/master/linuxdeploy-plugin-gstreamer.sh"
  chmod +x linuxdeploy-plugin-gstreamer.sh
else
  gst_plugin=""
fi

( cd "/home/mohamedsherif/.cache/tauri" && wget -q -4 -N https://raw.githubusercontent.com/tauri-apps/linuxdeploy-plugin-gtk/master/linuxdeploy-plugin-gtk.sh )
( cd "/home/mohamedsherif/.cache/tauri" && wget -q -4 -N https://github.com/tauri-apps/binary-releases/releases/download/linuxdeploy/linuxdeploy-${linuxdeploy_arch}.AppImage )

chmod +x "/home/mohamedsherif/.cache/tauri/linuxdeploy-plugin-gtk.sh"
chmod +x "/home/mohamedsherif/.cache/tauri/linuxdeploy-${linuxdeploy_arch}.AppImage"

dd if=/dev/zero bs=1 count=3 seek=8 conv=notrunc of="/home/mohamedsherif/.cache/tauri/linuxdeploy-${linuxdeploy_arch}.AppImage"

OUTPUT="pctrl_1.0.0_amd64.AppImage" "/home/mohamedsherif/.cache/tauri/linuxdeploy-${linuxdeploy_arch}.AppImage" --appimage-extract-and-run --appdir "pctrl.AppDir" --plugin gtk ${gst_plugin} --output appimage
