const Contact = require("../../models/contact.model");
const ContactMessage = require("../../models/contact-message.model");

module.exports.index = async (req, res) => {
  res.render("client/pages/contact", {
    pageTitle: "Contact Us"
  });
}

module.exports.sendMessagePost = async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;

    const newMessage = new ContactMessage({
      fullName: fullName,
      email: email,
      phone: phone || "",
      subject: subject,
      message: message
    });
    
    await newMessage.save();

    res.json({
      code: "success",
      message: "Thank you! Your message has been sent successfully. We will contact you soon."
    });
  } catch (error) {
    console.log(error);
    res.json({
      code: "error",
      message: "An error occurred. Please try again later."
    });
  }
}

module.exports.createPost = async (req, res) => {
  const { email } = req.body;

  const existEmail = await Contact.findOne({
    email: email,
    deleted: false
  })

  if(existEmail) {
    res.json({
      code: "error",
      message: "Your email has already been registered!"
    })
    return;
  }

  const newRecord = new Contact({
    email: email
  });
  await newRecord.save();

  res.json({
    code: "success",
    message: "Congratulations, you have successfully registered for the newsletter!"
  })
}