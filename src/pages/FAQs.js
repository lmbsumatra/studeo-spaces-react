import React, { useState } from "react";
import Footer from "../components/Footer";
import {
  Accordion,
  Form,
  Button,
  Container,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import io from "socket.io-client";
import { toast } from "react-toastify";

const FAQs = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    message: "",
  });
  const [loading, setLoading] = useState(false); // Loading state

  const socket = io("http://localhost:3002");

  const testNotificationData = {
    customer_id: null,
    customer_name: "Test User",
    message: "This is a test message",
    type: "customer_message",
    action_url: null,
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted
    try {
      // Sending the message
      await axios.post("http://127.0.0.1:8000/api/messages", formData);
      await axios.post(
        "http://127.0.0.1:8000/api/notifications",
        testNotificationData
      );

      // Notify user about success
      toast.success(
        "Message sent successfully! We will get back to you after 2 days."
      );
      socket.emit("Notification", {
        message: `A customer has sent a message!`,
      });

      // Clear form fields after successful submission
      setFormData({ email: "", name: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Oops! Failed to send message. Please try again.");
    } finally {
      setLoading(false); // Set loading to false after the request is completed
    }
  };

  return (
    <div className="container mt-5">
      <Container>
        <Row>
          {/* Accordion */}
          <Col>
            <p className="fs-400">Frequently asked</p>
            <h2 className="fs-700 ff-serif letter-spacing-1">Questions</h2>
            <Accordion defaultActiveKey="0" id="accordionExample">
              {/* Accordion items here */}
            </Accordion>
          </Col>

          {/* Email Us Form */}
          <Col>
            <p className="fs-400">Got other questions?</p>
            <h2 className="fs-700 ff-serif letter-spacing-1">
              Send us a message!
            </h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="exampleInputEmail1">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading} // Disable input when loading
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleInputName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading} // Disable input when loading
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleFormControlTextarea1"
              >
                <Form.Label>Message</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter your message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={loading} // Disable input when loading
                />
              </Form.Group>
              <Button
                variant="primary"
                className="btn btn-primary-clr"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{" "}
                    Sending...
                  </>
                ) : (
                  "Send"
                )}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default FAQs;
