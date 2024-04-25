/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom"
import { fireEvent, screen, waitFor } from "@testing-library/dom"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import mockStore from "../__mocks__/store.js"
import router from "../app/Router.js"
import userEvent from "@testing-library/user-event"

jest.mock("../app/store", () => mockStore)

beforeEach(() => {
  
  Object.defineProperty(window, "localStorage", { value: localStorageMock })
  window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }))

  const root = document.createElement("div")
  root.setAttribute("id", "root")
  document.body.append(root)

  router()

  window.onNavigate(ROUTES_PATH.NewBill)

  const onNavigate = (pathname) => {
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

describe("Given I am connected as an employee", () => {

  describe("When I am on NewBill Page", () => {  

    test("Then I upload a file with valid extension", async () => {
      const newBill = new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage});
      const handleChangeFile = jest.fn((event) => newBill.handleChangeFile(event))
      fileInput().addEventListener("change", handleChangeFile)
      const file = new File(["sample"], "test.jpeg", { type: "image/jpeg" })
      userEvent.upload(fileInput(), file)
      await waitFor(() => {
        expect(screen.queryByText("Extensions autorisées : jpeg, jpg ou png")).toBeNull()
      })
    })

    test("Then I upload a file with invalid extension", async () => {
      const newBill = new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage})
      const handleChangeFile = jest.fn((event) => newBill.handleChangeFile(event))
      const file = new File(["sample"], "test.pdf", { type: "application/pdf" })
      fileInput().addEventListener("change", handleChangeFile)
      userEvent.upload(fileInput(), file)
      
      await waitFor(() => {
        expect(screen.getByText("Extensions autorisées : jpeg, jpg ou png")).toBeTruthy()
      })
    })
    
    test("Then form submission is successful when all fields are filled correctly and redirects to Bills page", async () => {
      const onNavigate = pathname => {document.body.innerHTML = ROUTES({ pathname });}
      const newBill = new NewBill({document, onNavigate, store: mockStore, localStorage: window.localStorage})
      const handleChangeFile = jest.fn((event) => newBill.handleChangeFile(event))
      fileInput().addEventListener("change", handleChangeFile)
      const handleSubmit = jest.fn((event) => newBill.handleSubmit(event))
      form().addEventListener("submit", handleSubmit)
      const file = new File(["sample"], "test.jpeg", { type: "image/jpeg" })


      userEvent.selectOptions(expenseType(), ['Transports'])
      userEvent.type(expenseName(), 'Thomas A Anderson')
      userEvent.type(datepicker(), '2021-09-01')
      userEvent.type(amount(), '100')
      userEvent.type(vat(), '10')
      userEvent.type(pct(), '20')
      userEvent.upload(fileInput(), file)

      userEvent.click(submitButton())

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledTimes(1)
      })

      expect(screen.getByText("Mes notes de frais")).toBeTruthy()

    })
  }) 
})

function fileInput(){return screen.getByTestId('file')}
function form(){return screen.getByTestId('form-new-bill')}
function expenseType(){return screen.getByTestId('expense-type')}
function expenseName(){return screen.getByTestId('expense-name')}
function datepicker(){return screen.getByTestId('datepicker')}
function amount(){return screen.getByTestId('amount')}
function vat(){return screen.getByTestId('vat')}
function pct(){return screen.getByTestId('pct')}
function submitButton(){return screen.getByRole('button', {name: /envoyer/i})}