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

  findOneCustomerById = async (id) => {
    return await Customer.findOne({ _id: id })
      .then((res) => res)
      .catch((err) => {
        throw new BadContentError(err.reason);
      });
  };

  deleteCustomerByEmail = async (email) => {
    return await Customer.findOneAndDelete({ email: email });
  };

  updateCustomer = async (id, body) => {
    return await Customer.findOneAndUpdate({ _id: id }, body)
      .then((res) => res)
      .catch((err) => {
        console.log(err);
      });
  };
}

module.exports = CustomerRepository;
