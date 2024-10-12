const CustomerRepository = require("../database/repository/customer_repository");
const { generateSalt, generateEncryptedData, verifyData, generateJWT } = require("../util");

class CustomerService {
  constructor() {
    this.CustomerRepository = new CustomerRepository();
  }

  GetCustomers = async () => {
    const customers = await this.CustomerRepository.findAllCustomers();
    return { quantity: customers.length, customers };
  };

  SignUp = async (body) => {
    const salt = await generateSalt();
    const cryptPassword = await generateEncryptedData(body.password, salt);
    body.password = cryptPassword;
    return await this.CustomerRepository.createCustomer(body);
  };

  LogIn = async (body, req) => {
    const customer = await this.CustomerRepository.findOneCustomerByEmail(body.email);
    if (!customer) throw new Error("Customer Does Not Exists!");
    const decryptPassword = await verifyData(body.password, customer.password);
    if (!decryptPassword) throw new Error("Password incorrect!");
    const generatedToken = await generateJWT({ _id: customer._id, email: customer.email }, req);
    return { message: `${customer.email} has logged in successfully.`, token: generatedToken };
  };
}
module.exports = CustomerService;
