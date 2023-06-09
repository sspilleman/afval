// subDays(new Date(date), 1)

export const map = {
  "BRANCHES": "Takken",
  "GREEN": "GFT en Etensresten",
  "GREY": "Restafval",
  "PACKAGES": "Plastic verpakkingen, Blik en Drinkpakken",
  "TEXTILE": "Kleding en Textiel",
  "TREE": "TREE",
};

export interface ListItem {
  "pickupDates": string[];
  "pickupType": 1;
  "_pickupType": 1;
  "_pickupTypeText": "GREEN";
  "description": "HA ZLK GFT VR 2W 04 (w1a)";
}

export interface Json {
  "dataList": ListItem[];
}

const url = "https://wasteapi2.ximmio.com/api/GetCalendar";

const body = {
  "companyCode": "800bf8d7-6dd1-4490-ba9d-b419d6dc8a45",
  "startDate": "2022-12-21",
  "endDate": "2026-01-09",
  "community": "Haarlemmermeer",
  "uniqueAddressID": "1000045916",
};

export const getCalendar = async () => {
  const r = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      // "Accept": "application/json, text/plain, */*",
      // "Accept-Encoding": "gzip, deflate, br",
      "Content-Type": "application/json;charset=UTF-8",
    },
  });
  if (r.ok) {
    const json: Json = await r.json();
    return json;
  }
};
