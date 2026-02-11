#!/bin/sh
set -e

select_component() {
    current=0
    ESC=$(printf '\033')

    old_stty=$(stty -g < /dev/tty)
    trap 'printf "\033[?25h" > /dev/tty; stty "$old_stty" < /dev/tty; exit 1' INT TERM

    printf '\n  Select a component to install:\n\n' > /dev/tty
    printf '\033[?25l' > /dev/tty

    stty raw -echo < /dev/tty

    draw() {
        if [ "$current" = "0" ]; then
            printf '  \033[36m> opendata-log\033[0m          - query log files with SQL\033[K\r\n' > /dev/tty
        else
            printf '    opendata-log          - query log files with SQL\033[K\r\n' > /dev/tty
        fi
        if [ "$current" = "1" ]; then
            printf '  \033[36m> opendata-timeseries\033[0m  - query time series data with SQL\033[K\r\n' > /dev/tty
        else
            printf '    opendata-timeseries  - query time series data with SQL\033[K\r\n' > /dev/tty
        fi
        printf '\033[K\r\n  \033[2mArrow keys to move, Enter to select\033[0m\033[K' > /dev/tty
    }

    draw

    while true; do
        c=$(dd bs=1 count=1 2>/dev/null < /dev/tty; printf .)
        c=${c%.}

        if [ "$c" = "$(printf '\003')" ]; then
            printf '\033[?25h' > /dev/tty
            stty "$old_stty" < /dev/tty
            trap - INT TERM
            printf '\r\n' > /dev/tty
            exit 1
        fi

        if [ "$c" = "$(printf '\r')" ]; then
            break
        fi

        if [ "$c" = "$ESC" ]; then
            dd bs=1 count=1 2>/dev/null < /dev/tty > /dev/null 2>&1
            c3=$(dd bs=1 count=1 2>/dev/null < /dev/tty; printf .)
            c3=${c3%.}
            case "$c3" in
                A) [ "$current" -gt 0 ] && current=$((current - 1)) ;;
                B) [ "$current" -lt 1 ] && current=$((current + 1)) ;;
            esac
            printf '\033[3A\r' > /dev/tty
            draw
        fi
    done

    printf '\033[?25h' > /dev/tty
    stty "$old_stty" < /dev/tty
    trap - INT TERM

    printf '\n\n' > /dev/tty

    case "$current" in
        0) printf "log" ;;
        1) printf "timeseries" ;;
    esac
}

main() {
    NAME="$1"
    VERSION="$2"

    if [ -z "$NAME" ]; then
        NAME=$(select_component)
    fi

    case "$NAME" in
        log|timeseries) ;;
        *)
            echo "Error: unknown component '$NAME'. Must be 'log' or 'timeseries'." >&2
            exit 1
            ;;
    esac

    FULL_NAME="opendata-${NAME}"

    OS=$(uname -s)
    ARCH=$(uname -m)

    case "$OS" in
        Linux)
            case "$ARCH" in
                x86_64|amd64)   TARGET="x86_64-unknown-linux-gnu" ;;
                aarch64|arm64)  TARGET="aarch64-unknown-linux-gnu" ;;
                *)
                    echo "Error: unsupported Linux architecture: $ARCH" >&2
                    exit 1
                    ;;
            esac
            EXT="tar.gz"
            ;;
        Darwin)
            case "$ARCH" in
                arm64|aarch64)  TARGET="aarch64-apple-darwin" ;;
                *)
                    echo "Error: unsupported macOS architecture: $ARCH (only Apple Silicon is supported)" >&2
                    exit 1
                    ;;
            esac
            EXT="tar.gz"
            ;;
        MINGW*)
            case "$ARCH" in
                x86_64|amd64)   TARGET="x86_64-pc-windows-msvc" ;;
                *)
                    echo "Error: unsupported Windows architecture: $ARCH" >&2
                    exit 1
                    ;;
            esac
            EXT="zip"
            ;;
        *)
            echo "Error: unsupported operating system: $OS" >&2
            exit 1
            ;;
    esac

    if [ -z "$VERSION" ]; then
        echo "Fetching latest version for ${FULL_NAME}..."
        RELEASES_URL="https://api.github.com/repos/opendata-oss/opendata/releases"

        if command -v curl >/dev/null 2>&1; then
            RELEASES=$(curl -sSf "$RELEASES_URL")
        elif command -v wget >/dev/null 2>&1; then
            RELEASES=$(wget -qO- "$RELEASES_URL")
        else
            echo "Error: neither curl nor wget found." >&2
            exit 1
        fi

        TAG=$(printf '%s' "$RELEASES" | grep -o "\"tag_name\": *\"${FULL_NAME}/v[^\"]*\"" | head -1 | grep -o "${FULL_NAME}/v[^\"]*")

        if [ -z "$TAG" ]; then
            echo "Error: could not find a release for ${FULL_NAME}." >&2
            exit 1
        fi

        VERSION=$(echo "$TAG" | sed "s|${FULL_NAME}/v||")
        echo "Latest version: ${VERSION}"
    fi

    ARCHIVE="${FULL_NAME}-${VERSION}-${TARGET}.${EXT}"
    URL="https://github.com/opendata-oss/opendata/releases/download/${FULL_NAME}/v${VERSION}/${ARCHIVE}"

    TMP=$(mktemp)
    trap 'rm -f "$TMP"' EXIT

    echo "Downloading ${ARCHIVE}..."
    if command -v curl >/dev/null 2>&1; then
        curl -sSfL -o "$TMP" "$URL"
    elif command -v wget >/dev/null 2>&1; then
        wget -qO "$TMP" "$URL"
    else
        echo "Error: neither curl nor wget found." >&2
        exit 1
    fi

    echo "Extracting..."
    case "$EXT" in
        tar.gz) tar -xzf "$TMP" ;;
        zip)    unzip -o "$TMP" ;;
    esac

    echo ""
    echo "Successfully installed ${FULL_NAME} ${VERSION}"
    echo "Run ./${FULL_NAME} --help to get started."
}

main "$@"
