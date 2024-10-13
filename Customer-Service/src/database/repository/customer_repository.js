const Customer = require("../models/customer_model");
class CustomerRepository {
  constructor() {}

  findAllCustomers = async () => {
    return { count: await Customer.countDocuments(), customers: await Customer.find() };
  };

  createCustomer = async (newCustomerBody) => {
    const newCustomer = new Customer(newCustomerBody);
    await newCustomer.save();
    return newCustomer;
  };

  findOneCustomerByEmail = async (email) => {
    return await Customer.findOne({ email: email });
  };

  deleteCustomerByEmail = async (email) => {
    return await Customer.findOneAndDelete({ email: email });
  };
}

module.exports = CustomerRepository;
