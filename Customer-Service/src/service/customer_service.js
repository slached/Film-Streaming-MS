const { Genders, User_Icons } = require("../constants/customer_const");
const CustomerRepository = require("../database/repository/customer_repository");
const { GetAllS3Data, UploadToS3 } = require("../drivers/s3");
const { generateSalt, generateEncryptedData, verifyData, generateJWT, updateCache, setOrGetFromRedis } = require("../util");
const { NotFoundError, BadContentError } = require("../util/errors/app-errors");

class CustomerService {
  constructor() {
    this.CustomerRepository = new CustomerRepository();
  }

  GetCustomers = async () => {
    // get customers from cache if available
    const customers = await setOrGetFromRedis("customers", this.CustomerRepository.findAllCustomers);
    return customers;
  };

  GetCustomerById = async (id) => {
    const customer = await this.CustomerRepository.findOneCustomerById(id);
    if (!customer) throw new NotFoundError("This customer does not exists.");
    return customer;
  };

  SignUp = async (body) => {
    const salt = await generateSalt();
    const cryptPassword = await generateEncryptedData(body.password, salt);
    body.password = cryptPassword;

    switch (body.gender) {
      case Genders[1]:
        body.profileImageUrl = User_Icons.male;
        break;
      case Genders[2]:
        body.profileImageUrl = User_Icons.female;
      default:
        body.profileImageUrl = User_Icons.non;
        break;
    }

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
    return { msg: `${customers.length} customers created.` };
  };

  LogIn = async (body) => {
    const customer = await this.CustomerRepository.findOneCustomerByEmail(body.email);
    if (!customer) throw new NotFoundError("Customer Does Not Exists!");
    const decryptPassword = await verifyData(body.password, customer.password);
    if (!decryptPassword) throw new BadContentError("Password incorrect!");
    const payload = { _id: customer._id, email: customer.email };
    const generatedToken = await generateJWT(payload);
    return { message: `${customer.email} has logged in successfully.`, token: generatedToken };
  };

  DeleteCustomer = async (body) => {
    const deletedCustomer = await this.CustomerRepository.deleteCustomerByEmail(body.email);
    if (!deletedCustomer) throw new NotFoundError("There is no customer founded by this email.");
    // update customers after delete
    await updateCache("customers", this.CustomerRepository.findAllCustomers);
    return { message: `${deletedCustomer?.email} has deleted successfully.` };
  };

  UpdateCustomer = async (id, body) => {
    const updatedCustomer = await this.CustomerRepository.updateCustomer(id, body);
    // update customers after altered data
    await updateCache("customers", this.CustomerRepository.findAllCustomers);
    return { message: `${updatedCustomer?.email} has updated successfully.` };
  };

  UploadImageToS3 = async (user, image) => {
    return await UploadToS3(user._id, image.buffer, image.mimetype);
  };

  GetUserImageFromS3 = async (user) => {    
    return await GetAllS3Data(user._id);
  };
}
module.exports = CustomerService;
