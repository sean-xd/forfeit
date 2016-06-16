function el(id, parent){
  if(!parent) parent = document;
  if(id[0] === "#") return parent.getElementById(id.substr(1));
  if(id[0] === ".") return parent.getElementsByClassName(id.substr(1));
  return parent.getElementsByTagName(id);
}
function click(e, cb){
  e = (e[0] === "#") ? el(e) : el(e)[0]; // getElementById returns one element, anything else returns an array.
  if(e) e.addEventListener("click", cb);
}
