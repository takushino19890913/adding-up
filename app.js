'use strict';
const fs = require('fs'); // stands for file stream
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv'); // stream is the flow of data
//Node.js では、入出力が発生する処理をほとんど Stream という形で扱います。Stream は英語で「流れ」という意味です。
const rl = readline.createInterface({ 'input': rs, 'output': {} });
//The 'line' event is emitted whenever the input stream receives an end-of-line input (\n, \r, or \r\n).
// This usually occurs when the user presses the <Enter>, or <Return> keys
//改行された時呼ばれるイベント。rsをインプットして、改行を感知するたびに呼ばれる。

var prefectureDataMap = new Map();
rl.on('line', (lineString) => {
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const popu = parseInt(columns[3]);
  const prefecture = columns[1];
  if (year === 2010 || year === 2015) {
    let value = prefectureDataMap.get(prefecture);
    //prefectureは変化しない値なのでこれをキーとする。
    //valueが存在しなかったら初期化する。
    if (!value) {
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      };
    }
    if (year === 2010) {
      value.popu10 = popu;
    }
    if (year === 2015) {
      value.popu15 = popu;
    }
    prefectureDataMap.set(prefecture, value);
  }

});
// close イベントは　readlineがinputまたはoutputを全部読み込んだ時に発生する。
rl.on('close', () => {
  // let キーワードが必要
  for (let [key, value] of prefectureDataMap) {
   value.change = value.popu15 / value.popu10; // change、変化率がnullだったので、変更する。
 }
 // Array.from(Map)で、マップをArrayに変換できる。
 const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    return pair2[1].change - pair1[1].change;});// return節以降でネガティブが返されたら、pair1が先にソートされる。

    const rankingStrings = rankingArray.map(([key, value]) => {
      return key + ': ' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change;
    });//各要素対して、return以降の処理を施した値をArrayにして返す。
    console.log(rankingStrings);
});
