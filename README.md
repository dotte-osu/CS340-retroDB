# retroDB

## To run locally:

```
git clone https://github.com/xHoudek/retroDB.git
npm install
node app.js
```

If npm install doesn't work, download dependencies listed in `package.json` manually

### Merging a PR into master (main)

when merging a pull request from `dev` into `main`, be sure to use a ff-only commit so that we keep `dev` and `main` in sync (no extra merge commit):

```
git checkout dev
git pull
git checkout main
git pull
git merge dev --ff-only
```