# 公式のDev Containerイメージをベースに使用
# https://github.com/devcontainers/images/tree/main/src/dotnet
FROM mcr.microsoft.com/devcontainers/dotnet:10.0

# 定数の定義
ARG USERNAME=vscode \
    WORKSPACE=/home/${USERNAME}/app \
    BUN_VERSION="1.3.3"

RUN apt-get update && \
    apt-get upgrade -y

# rootだとなんとなく嫌なので、vscodeユーザーに切り替える
USER ${USERNAME}
WORKDIR /home/${USERNAME}

# Bunのインストールとmount先のnode_modulesディレクトリの作成
RUN curl -fsSL https://bun.com/install \
    | bash -s "bun-v${BUN_VERSION}" && \
    mkdir -p ${WORKSPACE}/node_modules
