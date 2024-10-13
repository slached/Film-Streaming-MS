const { BadContentError } = require("../../util/errors/app-errors");
const Customer = require("../models/customer_model");
class CustomerRepository {
  constructor() {}

  findAllCustomers = async () => {
    return { count: await Customer.countDocuments(), customers: await Customer.find() };
  };

  createCustomer = async (newCustomerBody) => {
    const newCustomer = new Customer(newCustomerBody);
    const customer = await newCustomer
      .save()
      .then((customer) => customer)
      .catch((err) => {
        if (err.code === 11000) {
          throw new BadContentError("Duplicated email in body.");
        }
      });
    return customer;
  };

  findOneCustomerByEmail = async (email) => {
    return await Customer.findOne({ email: email });
  };

  deleteCustomerByEmail = async (email) => {
    return await Customer.findOneAndDelete({ email: email });
  };
}

module.exports = CustomerRepository;
