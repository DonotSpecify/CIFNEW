import { openDB } from "idb";

const DB_NAME = 'NewprovinceDB2';
const DB_VERSION = 3;

const initDB = async (data) => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
    let ProvienceVec = [
        "北京市", "天津市", "河北省", "山西省", "内蒙古自治区",
        "辽宁省", "吉林省", "黑龙江省", "上海市", "江苏省",
        "浙江省", "安徽省", "福建省", "江西省", "山东省",
        "河南省", "湖北省", "湖南省", "广东省", "广西壮族自治区",
        "海南省", "重庆市", "四川省", "贵州省", "云南省",
        "西藏自治区", "陕西省", "甘肃省", "青海省", "宁夏回族自治区",
        "新疆维吾尔自治区", "香港特别行政区", "澳门特别行政区", "台湾省"
    ];
      // 创建新的对象仓库
      for (let i = 0; i < ProvienceVec.length; i++) {
        if (!db.objectStoreNames.contains(ProvienceVec[i])) {
          console.log("key----------",ProvienceVec[i]);
          db.createObjectStore(ProvienceVec[i], { keyPath: 'id' });
        }
      }
    },
  });
  return db;
};

const storeData = async (jsonData) => {
  try {
    const db = await initDB(jsonData);
    for (const [province, items] of Object.entries(jsonData)) {
      try {
        const tx = db.transaction(province, 'readwrite');
        const store = tx.objectStore(province);
        const promises = items.map(item => store.put(item));
        await Promise.all(promises);
        console.log(`${province} 的数据已存储`);
      } catch (error) {
        console.error(`${province} 的数据存储失败:`, error);
      }
    }
    console.log('所有数据已成功存储到 IndexedDB');
  } catch (error) {
    console.error('存储数据时出错:', error);
  }
};

// 读取JSON文件并存储到IndexedDB
const loadAndStoreData = () => {

  fetch('/allData.json')
    .then((response) => response.json())
    .then((jsonData) => {
      storeData(jsonData);
      for (const key in jsonData) {
        if (jsonData.hasOwnProperty(key)) {
          console.log(key, "---", jsonData[key]);
        }
      }
    })
    .catch((error) => {
      console.error('读取JSON文件出错:', error);
    });
};


export { loadAndStoreData, storeData, initDB };
