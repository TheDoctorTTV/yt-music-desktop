FROM ubuntu:22.04

ARG QT_VERSION=6.8.3
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential curl file libasound2 libgl1-mesa-dev libnss3 \
    libxcb-cursor0 libxkbcommon-x11-0 python3 python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Ubuntu 22.04's CMake predates this project's 3.24 minimum.
RUN python3 -m venv /opt/build-tools \
    && /opt/build-tools/bin/pip install --no-cache-dir 'cmake>=3.24,<4' aqtinstall \
    && /opt/build-tools/bin/aqt install-qt linux desktop "$QT_VERSION" linux_gcc_64 \
      -O /opt/qt -m qtwebengine qtwebchannel qtpositioning

RUN apt-get update && apt-get install -y --no-install-recommends \
    libdbus-1-3 libcups2 libfontconfig1 libfreetype6 libglib2.0-0 libgtk-3-0 \
    libwayland-cursor0 libwayland-egl1 libxcb-icccm4 libxcb-keysyms1 libxcb-shape0 \
    libxcomposite1 libxdamage1 libxi6 libxkbfile1 libxrandr2 libxrender1 libxtst6 \
    && rm -rf /var/lib/apt/lists/*
RUN /opt/qt/${QT_VERSION}/gcc_64/bin/qmake -query QT_INSTALL_PLUGINS

ENV PATH="/opt/build-tools/bin:${PATH}"
ENV CMAKE_PREFIX_PATH="/opt/qt/${QT_VERSION}/gcc_64"
ENV QMAKE="/opt/qt/${QT_VERSION}/gcc_64/bin/qmake"
WORKDIR /work
