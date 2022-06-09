const addBox = document.querySelector(".add-box"),
popupBox = document.querySelector(".popup-box"),
popupTitle = popupBox.querySelector("header p"),
closeIcon = popupBox.querySelector("header i"),
titleTag = popupBox.querySelector("input"),
descTag = popupBox.querySelector("textarea"),
addBtn = popupBox.querySelector("button");

const mesec = ["Januar", "Februar", "Marec", "April", "Maj", "Junij", "Julij",
              "Avgust", "September", "Oktober", "November", "December"];
const zapisek = JSON.parse(localStorage.getItem("zapisek") || "[]");
let isUpdate = false, updateId;

addBox.addEventListener("click", () => {
    popupTitle.innerText = "Dodaj nov zapisek";
    addBtn.innerText = "Dodaj zapisek";
    popupBox.classList.add("show");
    document.querySelector("body").style.overflow = "hidden";
    if(window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {
    isUpdate = false;
    titleTag.value = descTag.value = "";
    popupBox.classList.remove("show");
    document.querySelector("body").style.overflow = "auto";
});

function pokaziZapiske() {
    if(!zapisek) return;
    document.querySelectorAll(".note").forEach(li => li.remove());
    zapisek.forEach((note, id) => {
        let filterDesc = note.description.replaceAll("\n", '<br/>');
        let liTag = `<li class="note">
                        <div class="details">
                            <p>${note.title}</p>
                            <span>${filterDesc}</span>
                        </div>
                        <div class="bottom-content">
                            <span>${note.date}</span>
                            <div class="settings">
                                <i onclick="pokaziMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="menu">
                                    <li onclick="updateZapisek(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>Uredi</li>
                                    <li onclick="izbrisiZapisek(${id})"><i class="uil uil-trash"></i>Izbriši</li>
                                </ul>
                            </div>
                        </div>
                    </li>`;
        addBox.insertAdjacentHTML("afterend", liTag);
    });
}
pokaziZapiske();

function pokaziMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

function izbrisiZapisek(noteId) {
    let confirmDel = confirm("Ste prepričani, da želite izbrisati ta zapisek?");
    if(!confirmDel) return;
    zapisek.splice(noteId, 1);
    localStorage.setItem("zapisek", JSON.stringify(zapisek));
    pokaziZapiske
();
}

function updateZapisek(noteId, title, filterDesc) {
    let description = filterDesc.replaceAll('<br/>', '\r\n');
    updateId = noteId;
    isUpdate = true;
    addBox.click();
    titleTag.value = title;
    descTag.value = description;
    popupTitle.innerText = "Posodobite zapisek";
    addBtn.innerText = "Posodobite zapisek";
}

addBtn.addEventListener("click", e => {
    e.preventDefault();
    let title = titleTag.value.trim(),
    description = descTag.value.trim();

    if(title || description) {
        let trenutniDatum = new Date(),
        dan = trenutniDatum.getDate(),
        mesec1= mesec[trenutniDatum.getMonth()],
        leta = trenutniDatum.getFullYear();

        let casovniInfo = {title, description, date: ` ${dan} ${mesec1} ${leta}`}
        if(!isUpdate) {
            zapisek.push(casovniInfo);
        } else {
            isUpdate = false;
            zapisek[updateId] = casovniInfo;
        }
        localStorage.setItem("zapisek", JSON.stringify(zapisek));
        pokaziZapiske
    ();
        closeIcon.click();
    }
});