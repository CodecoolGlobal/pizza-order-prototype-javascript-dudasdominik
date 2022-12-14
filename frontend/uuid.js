async function assignUUID() {
  if (!document.cookie.includes("UUID")) {
    const response = await fetch("/api/generate/uuid");
    const uuid = await response.text();
    document.cookie = `UUID=${uuid}`;
  }
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

assignUUID();
