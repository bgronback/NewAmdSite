# NewAmdSite
new site for amd installation

To import JSON part data from terminal:

curl -H "Content-Type: application/json" -d @/Users/rgronback/git/NewAmdSite/src/main/resources/pricing.json http://165.227.102.88/api/v1/parts/list

To upload video file
curl -X POST -F type=takedowns -F 'file=@/Users/rgronback/Desktop/estimate.mp4' http://localhost:8080/api/v1/files

