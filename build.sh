cd blog/src/
yarn
npm run build
cd ../../
cp blog/src/public/* dist -r
cp presentations/* dist/presentations -r