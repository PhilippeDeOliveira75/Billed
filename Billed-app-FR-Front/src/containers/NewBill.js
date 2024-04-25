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
        console.log(fileUrl)
        this.billId = key
        this.fileUrl = fileUrl
        this.fileName = fileName
      })
      .catch(error => console.error(error))
  }

  handleSubmit = e => {

    e.preventDefault()

    // Sélection des champs obligatoires et leurs messages d'erreur
    const fields = [
      { input: 'expense-name', errorId: 'nameErrorMessage', message: 'Vous devez ajouter le nom de la dépense' },
      { input: 'datepicker', errorId: 'dateErrorMessage', message: 'Vous devez ajouter une date' },
      { input: 'amount', errorId: 'amountErrorMessage', message: 'Vous devez ajouter le montant TTC' },
      { input: 'vat', errorId: 'vatErrorMessage', message: 'Vous devez ajouter le montant de la TVA' },
      { input: 'pct', errorId: 'pctErrorMessage', message: 'Vous devez ajouter le pourcentage de la TVA' },
      { input: 'file', errorId: 'fileErrorMessage', message: 'Vous devez ajouter un fichier au format jpg, jpeg ou png' }
    ]

    // Vérification des champs vides
    let isValid = true

    fields.forEach(({ input, errorId, message }) => {
      const inputElement = e.target.querySelector(`[data-testid="${input}"]`)
      const errorElement = document.getElementById(errorId)

      if (inputElement.value.trim() === '') {
        errorElement.textContent = message
        errorElement.style.display = 'block'
        isValid = false;
      } else {
        errorElement.textContent = ''
        errorElement.style.display = 'none'
      }
    })

    // Vérifier si l'extension du fichier est autorisée avant de soumettre le formulaire
    const allowedExtensions = ["jpeg", "jpg", "png"]
    if (!allowedExtensions.includes(this.fileExtension)) {
      const fileErrorMessage = document.getElementById("fileErrorMessage")
      fileErrorMessage.textContent = "Extensions autorisées : jpeg, jpg ou png"
      fileErrorMessage.style.display = "block"
      isValid = false
    }

    // Envoi du formulaire si tout est valide
    if (isValid) {
      const email = JSON.parse(localStorage.getItem("user")).email
      const nameInput = e.target.querySelector(`[data-testid="expense-name"]`)
      const amountInput = e.target.querySelector(`[data-testid="amount"]`)
      const dateInput = e.target.querySelector(`[data-testid="datepicker"]`)
      const vatInput = e.target.querySelector(`[data-testid="vat"]`)
      const pctInput = e.target.querySelector(`[data-testid="pct"]`)

      const bill = {
          email,
          type: e.target.querySelector('select[data-testid="expense-type"]').value,
          name: nameInput.value.trim(),
          amount: parseInt(amountInput.value.trim()),
          date: dateInput.value.trim(),
          vat: vatInput.value.trim(),
          pct: parseInt(pctInput.value.trim()),
          commentary: e.target.querySelector('textarea[data-testid="commentary"]').value.trim(),
          fileUrl: this.fileUrl,
          fileName: this.fileName,
          status: 'pending'
      }
  
      this.updateBill(bill);
      this.onNavigate(ROUTES_PATH['Bills'])

    } else {
      // Affichage du message d'erreur général
      const submitError = document.getElementById('submitErrorMessage')
      if (submitError) {
          submitError.style.display = 'block'
      }
    }
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