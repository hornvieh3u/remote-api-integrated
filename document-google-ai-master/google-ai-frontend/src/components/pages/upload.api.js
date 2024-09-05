import config from '../../config'

export async function Update(id, data) {
  const result = await fetch(`${ config.SERVER_URL }/api/upload/update`  , {
    method: "POST",
    headers: defaultJsonHeaders,
    body: JSON.stringify({ id: id, data: data })

  });
  if (result.ok) {
    return await result.json();
  }

}

export async function Upload(data, pId) {
  const uploadResponse = await fetch(`${ config.SERVER_URL }/api/upload/upload`, {
      method: "POST",
      headers: {
        "accept": "*/*",
        "Content-Type": "application/json"
      },
      // body: '{\n  "imageData": "string",\n  "processId": "string"\n}',
      body: JSON.stringify({
        "imageData": data,
        "processId": pId
      })
    });
  if (uploadResponse.ok) {
    return await uploadResponse.json();
  }
}

export async function Load(id) {
  const result = await fetch(`${ config.SERVER_URL }/api/upload/get?id=` + id, {
    method: "Get",
    headers: defaultJsonHeaders
  });
  if (result.ok) {
    return await result.json();
  }
}

const defaultJsonHeaders = {
  "accept": "*/*",
  "Content-Type": "application/json"
};
