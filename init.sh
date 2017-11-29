apt-get update
apt-get install gradle
apt-get install openjdk-8-jdk
mkdir git
cd git
git clone https://github.com/bgronback/NewAmdSite.git
cd NewAmdSite
docker-compose up -d registry
gradle publishDocker
docker-compose up -d amd
