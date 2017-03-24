if [ -d "docs" ]; then
    rm -rf "docs" 
    mkdir "docs"
fi
export GITHUB_DEPLOY="ng2-scroll-slider"
export LIVE_BACKEND=true
export ENV="production"
npm run build:prod
mv dist docs
echo "done !"

