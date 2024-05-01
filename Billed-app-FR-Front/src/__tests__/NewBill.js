/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom"
import { fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBill from "../containers/NewBill.js"
import NewBillUI from "../views/NewBillUI.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store.js"
import router from "../app/Router.js"
import userEvent from "@testing-library/user-event"

jest.mock("../app/store", () => mockStore)

describe("Given I am connected as an employee", () => {
  let onNavigate
  beforeEach(() => {
  
    Object.defineProperty(window, "localStorage", { value: localStorageMock })
    window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }))
  
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.append(root)
  
    router()
  
    window.onNavigate(ROUTES_PATH.NewBill)
  
    onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
  
    const employeeNewBillsPage = new NewBill({
      document,
      onNavigate,
      store: mockStore,
      localStorage: localStorageMock,
   })
  
    return { root, onNavigate, employeeNewBillsPage }
  })
  
  afterEach(() => {
    jest.resetAllMocks()
    document.body.innerHTML = ""
  })

  describe("When I am on NewBill Page", () => {  

    test("Then i load an incorrect file format and an error message appears", async () => {

      const htlmNewBillUI = NewBillUI()
      document.body.innerHTML = htlmNewBillUI

      // Init a new Bill
      const newBill = new NewBill({document, onNavigate, store: mockStore, localStorage })
      newBill.type = "image/png"
      newBill.email = "test@test.com"

      const file = new File(["test.pdf"], "test.pdf", { type: "image/pdf" })
      
      // File updload
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      const supportingFileInput = screen.getByTestId('file')      
      supportingFileInput.addEventListener("change", (e) => handleChangeFile(e))
      userEvent.upload(supportingFileInput, file)

      expect(screen.getByText('Extensions autorisées : jpeg, jpg ou png')).toBeTruthy()

    })

    test("Then form submission is successful when all fields are filled correctly and redirects to Bills page", async () => {
      const htlmNewBillUI = NewBillUI()
      document.body.innerHTML = htlmNewBillUI

      // File and data
      const file = new File(["test.png"], "test.png", { type: "image/png" })
      const name = 'marcel'
      const date = "2024-04-11"
      const amount = '100'
      const vat = '20'
      const pct = '20'

      // Init a new Bill
      const newBill = new NewBill({document, onNavigate, store: mockStore, localStorage })
      newBill.type = "image/png"
      newBill.email = "test@test.com"

      // File updload
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      const supportingFileInput = screen.getByTestId('file')      
      supportingFileInput.addEventListener("change", (e) => handleChangeFile(e))
      userEvent.upload(supportingFileInput, file)

      // Set name
      const nameInput = screen.getByTestId('expense-name')
      userEvent.type(nameInput, name)

      // Set bill date
      const datePickerInput = screen.getByTestId('datepicker')
      userEvent.type(datePickerInput, date)

      // Set amount
      const amountInput = screen.getByTestId('amount')
      userEvent.type(amountInput, amount)

      // Set vat
      const vatInput = screen.getByTestId('vat')
      userEvent.type(vatInput, vat)

      // Set pct
      const pctInput = screen.getByTestId('pct')
      userEvent.type(pctInput, pct)

      // Submit
      const handleSubmit = jest.fn(newBill.handleSubmit)
      const submitBtn = screen.getByText("Envoyer")

      submitBtn.addEventListener('click', () => handleSubmit)
      fireEvent.click(submitBtn)

      // Waiting result
      await waitFor(() => {
        expect(screen.getByText('Mes notes de frais')).toBeTruthy()
      })

    })
  }) 
})
