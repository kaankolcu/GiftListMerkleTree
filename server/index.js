const express = require("express");
const verifyProof = require("../utils/verifyProof");
const MerkleTree = require("../utils/MerkleTree");
const niceList = require("../utils/niceList");

const port = 1225;

const app = express();
app.use(express.json());

let merkleTree = new MerkleTree(niceList);

let merkleRoot = merkleTree.getRoot();
// paste the hex string in here, without the 0x prefix
const MERKLE_ROOT = merkleRoot;

app.post("/gift", (req, res) => {
  // grab the parameters from the front-end here
  const body = req.body;

  const name = body.name;
  const index = niceList.findIndex((n) => n === name);
  const proof = merkleTree.getProof(index);

  // TODO: prove that a name is in the list
  const isInTheList = verifyProof(proof, name, merkleRoot);

  console.log(isInTheList);

  if (isInTheList) {
    res.send("You got a toy robot!");
  } else {
    res.send("You are not on the list :(");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
