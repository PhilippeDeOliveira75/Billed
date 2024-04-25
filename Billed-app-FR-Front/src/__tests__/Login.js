/**
 * @jest-environment jsdom
 */

import LoginUI from "../views/LoginUI"
import Login from "../containers/Login.js"
import { ROUTES } from "../constants/routes"
import { fireEvent, screen } from "@testing-library/dom"

function setupLoginTest(userType) {

  document.body.innerHTML = LoginUI()
  const inputData = {
    email: "jppdes@tests.com",
    password: "altF4",
  }

  const inputEmailUser = screen.getByTestId(`${userType}-email-input`)
  fireEvent.change(inputEmailUser, { target: { value: inputData.email } })

  expect(inputEmailUser.value).toBe(inputData.email)

  const inputPasswordUser = screen.getByTestId(`${userType}-password-input`)
  fireEvent.change(inputPasswordUser, {
    target: { value: inputData.password },
  })

  expect(inputPasswordUser.value).toBe(inputData.password)

  const form = screen.getByTestId(`form-${userType}`)

  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: jest.fn(() => null),
      setItem: jest.fn(() => null),
    },
    writable: true,
  })

  const onNavigate = (pathname) => {
    document.body.innerHTML = ROUTES({ pathname })
  }

  let tmp = ""

  const store = jest.fn()

  const login = new Login({
    document,
    localStorage: window.localStorage,
    onNavigate,
    tmp,
    store,
  })

  const handleSubmit = jest.fn(userType === 'employee' ? login.handleSubmitEmployee : login.handleSubmitAdmin)
  login.login = jest.fn().mockResolvedValue({})
  form.addEventListener("submit", handleSubmit)
  fireEvent.submit(form)
  expect(handleSubmit).toHaveBeenCalled()
  expect(window.localStorage.setItem).toHaveBeenCalled()
  expect(window.localStorage.setItem).toHaveBeenCalledWith(
    "user",
    JSON.stringify({
      type: userType === 'employee' ? "Employee" : "Admin",
      email: inputData.email,
      password: inputData.password,
      status: "connected",
    })
  )
}

//Test login identified as an Employee
describe("Given that I am a user on login page", () => {
  describe("When fields have correct format and I click on employee button Login In", () => {
    test("Then I should be identified as an employee", () => {
      setupLoginTest('employee')
    })

    test("It should renders Bills page", () => {
      expect(screen.getAllByText("Mes notes de frais")).toBeTruthy()
    })
  })
})

//Test login identified as an Admin
describe("Given that I am a user on login page", () => {
  describe("When fields have correct format and I click on admin button Login In", () => {
    test("Then I should be identified as an admin", () => {
      setupLoginTest('admin')
    })

    test("It should renders admin dashboard page", () => {
      expect(screen.queryByText("Validations")).toBeTruthy()
    })
  })
})