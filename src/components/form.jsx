import React, { Component } from "react";
import { Form, Icon, Input, Button, DatePicker, Cascader } from "antd";
import moment from "moment";

const category = [
    {
        value: "travel",
        label: "Travel",
        children: [
            {
                value: "cab",
                label: "Cab",
                children: [
                    {
                        value: "ola",
                        label: "Ola"
                    },
                    {
                        value: "uber",
                        label: "Uber"
                    }
                ]
            },
            {
                value: "publicTransport",
                label: "Public Transport",
                children: [
                    {
                        value: "train",
                        label: "Train"
                    },
                    {
                        value: "bus",
                        label: "Bus"
                    }
                ]
            }
        ]
    },
    {
        value: "food",
        label: "Food",
        children: [
            {
                value: "app",
                label: "Online Order",
                children: [
                    {
                        value: "zomato",
                        label: "Zomato"
                    }
                ]
            }
        ]
    }
];
function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class FormComponent extends Component {
    componentDidMount() {
        // To disable submit button at the beginning.
        this.props.form.validateFields();
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onDataAdd(values);
            }
        });
        this.props.form.resetFields();
        this.props.form.validateFields();
    };

    render() {
        const {
            getFieldDecorator,
            getFieldsError,
            getFieldError,
            isFieldTouched
        } = this.props.form;

        // Only show error after a field is touched.
        let nameError = isFieldTouched("name") && getFieldError("name");
        let amountError = isFieldTouched("amount") && getFieldError("amount");
        let dateError = isFieldTouched("date") && getFieldError("date");
        let categoryError =
            isFieldTouched("category") && getFieldError("category");

        const config = {
            rules: [
                {
                    type: "object",
                    required: true,
                    message: "Please select date!"
                }
            ]
        };
        return (
            <Form layout="inline" onSubmit={this.handleSubmit}>
                <Form.Item
                    validateStatus={nameError ? "error" : ""}
                    help={nameError || ""}
                >
                    {getFieldDecorator("name", {
                        rules: [
                            {
                                required: true,
                                message: "Please Enter the name!"
                            }
                        ]
                    })(
                        <Input
                            prefix={
                                <Icon
                                    type="user"
                                    style={{ color: "rgba(0,0,0,.25)" }}
                                />
                            }
                            placeholder="Name"
                        />
                    )}
                </Form.Item>
                <Form.Item
                    validateStatus={amountError ? "error" : ""}
                    help={amountError || ""}
                >
                    {getFieldDecorator("amount", {
                        rules: [
                            {
                                warning: false,
                                required: true,
                                message: "Please input the Amount!"
                            }
                        ]
                    })(
                        <Input
                            prefix="₹"
                            type="number"
                            min={0}
                            placeholder="Amount"
                        />
                    )}
                </Form.Item>

                <Form.Item
                    validateStatus={dateError ? "error" : ""}
                    help={dateError || ""}
                >
                    {getFieldDecorator(
                        "date",
                        { initialValue: moment(new Date(), "DD-MM-YY") },
                        config
                    )(<DatePicker />)}
                </Form.Item>

                <Form.Item
                    validateStatus={categoryError ? "error" : ""}
                    help={categoryError || ""}
                >
                    {getFieldDecorator("category", {
                        rules: [
                            {
                                type: "array",
                                required: true,
                                message: "Please select the Date",
                                suppressWarning: true
                            }
                        ]
                    })(<Cascader options={category} />)}
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        disabled={hasErrors(getFieldsError())}
                    >
                        Add
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}
const WrappedFormComponent = Form.create({ name: "horizontal_login" })(
    FormComponent
);
export default WrappedFormComponent;
