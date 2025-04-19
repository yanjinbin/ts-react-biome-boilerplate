namespace=ts-react-biome-boilerplate
Version=`git describe --tag  --abbrev=0`
build_time=`date +%FT%T%z`
commit_hash=`git rev-parse --short HEAD`
PORT = 5173  # 要杀死进程的端口号
PID = $(shell lsof -t -i :$(PORT))  # 获取占用指定端口的进程ID


biome:
	pnpm run biome

reinstall:
	rm -rf pnpm-local.yaml
	rm -rf node_modules
	pnpm install


# make run PORT=5173 MODE=development
run:
	vite . --port $(PORT) --mode $(MODE)

# 基础cli
uvSetup:
	export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890
	curl -LsSf https://astral.sh/uv/install.sh | sh


preHookSetup:
	@go install github.com/google/yamlfmt/cmd/yamlfmt@latest
	@pnpm install @biomejs/biome@1.9.4
	@pnpm install -g depcheck
	@pnpm install -g npm-check-updates
	@uv venv
	@uv pip install pre-commit
	@pre-commit install
	@uv tool install commitizen

prune:
	pnpm prune

depend-analyze:
	depcheck