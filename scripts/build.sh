# Description: build docker image for frontend
# if build with loongnix platform, use --image argument to specify base image
# Usage: bash ./scripts/build.sh --image cr.loongnix.cn/library/nginx:1.23.1-alpine

cd "$(dirname "$0")"/.. || exit 1

# read src/environments/environment.ts and get version value
version=$(grep version src/environments/environment.ts | cut -d"'" -f2)
repo="harbor.prod.com.cn"
image="nginx:1.23-alpine"
macos=false

while [ -n "$1" ]
do
  case "$1" in
    --image) image=$2
      shift ;;
    --version) version=$2
      shift ;;
    --repo) repo=$2
      shift ;;
    --macos) macos=true ;;
    *) echo "$1 is not an option"
      exit 3 ;;
  esac
  shift
done

echo "frontend version: ${version}"
echo "image: ${image}"
echo "repo: ${repo}"
echo "macos: ${macos}"

npm run build

# 如果是macos系统，需要使用docker buildx
if [ "$macos" = true ]; then
  echo "macos"
  docker buildx build --platform=linux/amd64 -t "${repo}"/jeanne/jeanne:"${version}" --build-arg BASE_IMAGE="$image" .
else
  docker build -t "${repo}"/jeanne/jeanne:"${version}" --build-arg BASE_IMAGE="$image" .
fi

docker push "${repo}"/jeanne/jeanne:"${version}"
