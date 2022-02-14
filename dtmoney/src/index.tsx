import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { createServer, Model } from "miragejs";

createServer({

  models: {
    transaction: Model,

  },

  seeds(server) {
    server.db.loadData({
        transactions: [
          {
            id: 1,
            title: "Transaction 1",
            amount: 400,
            type: "deposit",
            category: "Food",
            createdAt: new Date(),
          },
          {
            id: 2,
            title: "Transaction 2",
            amount: 200,
            type: "withdraw",
            category: "Casa",
            createdAt: new Date(),
          },
        ]
    });
  },

  routes() {
    this.namespace = "api";

    this.get("/transactions", () => {
      return this.schema.all('transaction');
    });

    this.post("/transactions", (schema, request) => {
      const data = JSON.parse(request.requestBody);

      return schema.create('transaction', data);
    });
  },
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
