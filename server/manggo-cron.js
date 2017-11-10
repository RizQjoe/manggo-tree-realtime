
const firebase = require('firebase')
const cron = require('node-cron')

 var config = {
    apiKey: "AIzaSyBkmrCaNIfJo8zXJODKD51NHjU9HWtSTxM",
    authDomain: "kanban-vue.firebaseapp.com",
    databaseURL: "https://kanban-vue.firebaseio.com",
    projectId: "kanban-vue",
    storageBucket: "kanban-vue.appspot.com",
    messagingSenderId: "429292777928"
};

firebase.initializeApp(config)
let db = firebase.database()


class FruitTree {
  constructor(age = 0, height = 0, fruit = 0, status = true, name) {
    this.name = name;
    this.umur = age;
    this.tinggi = height;
    this.jumlahBuah = [];
    this.harvested = null;
    this.status = status;
    this.fruit = this.produceFruit(fruit);
  }

  getAge() {return this.umur;}
    
  getHeight() {return this.tinggi;}

  getFruits() {return this.jumlahBuah;}

  getHealtyStatus() {
      if (this.status) {return "sehat";} 
      else {return "sakit";}
  }

  // Grow the tree
  grow() {
    if (this.umur < 20) {
      this.umur += 1;
      this.tinggi += Math.floor(Math.random() * this.maxGrow + 1);
    } else {
      this.status = false;
    }
  }

  // Produce mangoes
  produceFruit(jumlah = Math.floor(Math.random() * this.max + 1)) {
    let random = jumlah;
    for (let i = 0; i < random; i++) {
        this.jumlahBuah.push(new Manggo()); //Call nama class Super yang di class manggo extends Fruit
    }
    return this.jumlahBuah.length;
  }

  // Get fruits
  harvest() {
    let good = 0; let bad = 0;
    for (let i = 0; i < this.jumlahBuah.length; i++) {
      if (this.jumlahBuah[i].status == "bad") {
            good += 1;
        }else {
            bad += 1;}
    }

    let total = this.jumlahBuah.length;
    this.jumlahBuah = [];
    this.harvested = `${total} (${good} good, ${bad} bad)`;
  }
}


class Fruit {
  constructor() {
    this.status = this.quality();
  }

  quality() {
    let status; let rand = Math.floor(Math.random() * 2 + 1);
    if (rand === 1) {
        status = "good";
    } 
    else {
        status = "bad";
    }
        return status;
  }
}


// Manggo tree
class MangoTree extends FruitTree {
  // New Initialize MangoTree
  constructor(age = 0,height = 0,fruit = 0, status = true,name = "MangoTree") 
  {
    super(age, height, fruit, status, name);
    this.max = 10;
    this.maxGrow = 5;
  }
}

class Manggo extends Fruit {
  // Produce a mango
  constructor() {
    super();
  }
}

console.log("\n        ==**== Pohon Mangga Tetangga ==**==                        \n");
let mangoTree = new MangoTree();
db.ref("manggo-tree").set(mangoTree);

let task = cron.schedule("*/1 * * * * *", function() {
  if (mangoTree.status != false) {
    mangoTree.grow();
    mangoTree.produceFruit();
    mangoTree.harvest();
    db.ref("manggo-tree").set(mangoTree);
    console.log(
      `[Year ${mangoTree.umur} Report] Height = ${mangoTree.tinggi} | Fruits harvested = ${mangoTree.harvested}`
    );
  } else {
    task.stop();
    console.log(" \n                  Pohon Tetangga Mati             \n");
  }
});