import icon from "./icon.js";

const node = document.getElementById("wrapper");
icon.forEach((element) => {
	let data = document.createElement(`div`);
	data.innerHTML = `<i class="ic ${element}"></i>`
	data.innerHTML += element.slice(3);
	data.addEventListener('click', () => {
		navigator.clipboard.writeText(element);
		alert(element + ' has been copied to clipboard');
	})
	node.appendChild(data);
});
