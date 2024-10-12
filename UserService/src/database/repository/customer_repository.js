const Customer = require("../models/customer_model");
class CustomerRepository {
  constructor() {}

  findAllCustomers = async () => {
    return await Customer.find();
  };

  createCustomer = async (newCustomerBody) => {
    const newCustomer = new Customer(newCustomerBody);
    await newCustomer.save();
    return newCustomer;
  };

  findOneCustomerByEmail = async (email) => {
    return await Customer.findOne({ email: email });
  };
}

module.exports = CustomerRepository;
