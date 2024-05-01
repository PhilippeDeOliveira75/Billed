import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"


export default class NewBill {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
    formNewBill.addEventListener("submit", this.handleSubmit)
    const file = this.document.querySelector(`input[data-testid="file"]`)
    file.addEventListener("change", this.handleChangeFile)
    this.fileUrl = null
    this.fileName = null
    this.billId = null
    new Logout({ document, localStorage, onNavigate })
  }

  handleChangeFile = e => {
    e.preventDefault();
    const fileInput = this.document.querySelector(`input[data-testid="file"]`)
    const file = fileInput.files[0]
    const allowedExtensions = ["jpeg", "jpg", "png"]
    const fileExtension = file.name.split(".").pop().toLowerCase()
    const fileErrorMessage = document.getElementById("fileErrorMessage")

    // Vérifier si l'extension du fichier est autorisée
    if (!allowedExtensions.includes(fileExtension)) {
      // Afficher le message d'erreur
      fileErrorMessage.textContent = "Extensions autorisées : jpeg, jpg ou png"
      fileErrorMessage.style.display = "block"

      // Effacer la valeur du champ de fichier
      fileInput.value = ""
      
      return
    }

    // Stocker l'extension du fichier dans l'état du composant
    this.fileExtension = fileExtension
  
    const filePath = fileInput.value.split(/\\/g)
    const fileName = filePath[filePath.length - 1]
    const formData = new FormData()
    const email = JSON.parse(localStorage.getItem("user")).email
    formData.append("file", file)
    formData.append("email", email)
  
    this.store
      .bills()
      .create({
        data: formData,
        headers: {
          noContentType: true
        }
      })
      .then(({ fileUrl, key }) => {
        this.billId = key
        this.fileUrl = fileUrl
        this.fileName = fileName
      })
      .catch(error => console.error(error))
  }

handleSubmit = e => {
  
    e.preventDefault();

  
    const email = JSON.parse(localStorage.getItem("user")).email;
    const bill = {
      email,
      type: document.querySelector('#expense-type').value,
      name: document.querySelector('#expense-name').value.trim(),
      date: document.querySelector('#datepicker').value,
      amount: parseInt(document.querySelector('#amount').value),
      vat: parseInt(document.querySelector('#vat').value),
      pct: parseInt(document.querySelector('#pct').value) || 20,
      commentary: document.querySelector('#commentary').value,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      status: 'pending'
    };
  
    this.updateBill(bill);
    this.onNavigate(ROUTES_PATH['Bills']);
  }
  
  // not need to cover this function by tests
  /* istanbul ignore next */
  updateBill = (bill) => {
    if (this.store) {
      this.store
      .bills()
      .update({data: JSON.stringify(bill), selector: this.billId})
      .then(() => {
        this.onNavigate(ROUTES_PATH['Bills'])
      })
      .catch(error => console.error(error))
    }
  }
}