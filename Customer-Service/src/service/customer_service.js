const CustomerRepository = require("../database/repository/customer_repository");
const { generateSalt, generateEncryptedData, verifyData, generateJWT, updateCache, setOrGetFromRedis } = require("../util");
const { NotFoundError, BadContentError } = require('../util/errors/app-errors');

class CustomerService {
  constructor() {
    this.CustomerRepository = new CustomerRepository();
  }

  GetCustomers = async () => {
    // get customers from cache if available
    const customers = await setOrGetFromRedis("customers", this.CustomerRepository.findAllCustomers);
    return customers;
  };

  SignUp = async (body) => {
    const salt = await generateSalt();
    const cryptPassword = await generateEncryptedData(body.password, salt);
    body.password = cryptPassword;
    const createNewCustomer = await this.CustomerRepository.createCustomer(body);
    // update customers after insertion
    await updateCache("customers", this.CustomerRepository.findAllCustomers);
    return createNewCustomer;
  };

  CreateMultipleCustomer = async (customers) => {
    for (const customer of customers) {
      const salt = await generateSalt();
      const cryptPassword = await generateEncryptedData(customer.password, salt);
      customer.password = cryptPassword;
      await this.CustomerRepository.createCustomer(customer);
    }

    // update customers after insertion
    await updateCache("customers", this.CustomerRepository.findAllCustomers);
    return { msg: `${customers.length} customer created.` };
  };

  LogIn = async (body) => {
    const customer = await this.CustomerRepository.findOneCustomerByEmail(body.email);
    if (!customer) throw new NotFoundError("Customer Does Not Exists!");
    const decryptPassword = await verifyData(body.password, customer.password);
    if (!decryptPassword) throw new BadContentError("Password incorrect!");
    const generatedToken = await generateJWT({ _id: customer._id, email: customer.email });
    return { message: `${customer.email} has logged in successfully.`, token: generatedToken };
  };

  DeleteCustomer = async (body) => {
    const deletedCustomer = await this.CustomerRepository.deleteCustomerByEmail(body.email);
    if (!deletedCustomer) throw new NotFoundError("There is no customer founded by this email.");
    // update customers after delete
    await updateCache("customers", this.CustomerRepository.findAllCustomers);
    return { message: `${deletedCustomer?.email} has deleted successfully.` };
  };
}
module.exports = CustomerService;
