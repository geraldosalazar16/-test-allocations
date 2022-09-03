/**
Coding Exercise.

This is a FIFO problem. We have products arriving based on supply, and then sent to customers based on demand.

Demand is items going out to the customers.
Supply is items coming in from the vendors
 
We need to match the two. I have a long description below, but that is essentially all we’re looking for.

I’ve chosen this because it’s not a standard coding exercise that he will be able to Google the solution for.

The idea is to see if the candidate can understand the business problem, and can write a solution with readable concise code.
 */

const salesOrders = [
  {
    id: 'S1',

    created: '2020-01-02',

    quantity: 6,
  },
  {
    id: 'S2',

    created: '2020-11-05',

    quantity: 2,
  },
  {
    id: 'S3',

    created: '2019-12-04',

    quantity: 3,
  },
  {
    id: 'S4',

    created: '2020-01-20',

    quantity: 2,
  },
  {
    id: 'S5',

    created: '2019-12-15',

    quantity: 9,
  },
];

const purchaseOrders = [
  {
    id: 'P1',

    receiving: '2020-01-04',

    quantity: 4,
  },
  {
    id: 'P2',

    receiving: '2020-01-05',

    quantity: 3,
  },
  {
    id: 'P3',

    receiving: '2020-02-01',

    quantity: 5,
  },
  {
    id: 'P4',

    receiving: '2020-03-05',

    quantity: 1,
  },
  {
    id: 'P5',

    receiving: '2020-02-20',

    quantity: 7,
  },
];

// Sales Orders are orders created by a customer for us to provide a product

// This is the demand.

// 'created': when the sales order was created

// 'quantity': how many items the customer wants

// Purchase Orders are orders created by us to receive a product

// This is the supply.

// 'receiving': when we expect to receive the product

// 'quantity': how many we will be receiving

// We want to supply the products to the customers in the order in which

// they were requested.

// Implement the function 'allocate'.

// The function should return an Array of elements. Each element should include

// -> the ID of the sales order

// -> the date the customer should expect to get the item

// Additional

// - we only send the product once we have enough for that sales order

// - (so if the sales order is for 2, we need to have 2 available before sending)

// - the function should support any number of sales orders or purchase orders

// - to make it simple we only have one product

function allocate(salesOrders, purchaseOrders) {
  // Once an allocation is possible it will be stored here
  const allocations = [];

  // Merge all the transactions to be performed
  const transactions = salesOrders.concat(purchaseOrders);
  // Order salesOrders by date
  const orderedTransactions = transactions.sort(
    (transactionA, transactionB) => {
      return getOperationDate(transactionA) - getOperationDate(transactionB);
    }
  );

  // Keep track of the current supply
  let currentSupply = 0;
  let currentDeliveryDate = null;
  let initialSaleOrderDate = null;
  const pendingOrders = [];
  for (const transaction of orderedTransactions) {
    // Transactions with rreceiving date will add to the current supply value
    if (transaction.receiving) {
      currentSupply += transaction.quantity;
      currentDeliveryDate = transaction.receiving;
      console.log(
        `At ${currentDeliveryDate} supply is increased by ${transaction.quantity} for a total of ${currentSupply}`
      );
      // Try to clear pending orders
      const ordersToRemove = [];
      for (const pendingOrder of pendingOrders) {
        if (pendingOrder.quantity <= currentSupply) {
          // Save the order once allocated so it can be removed from the pending orders
          ordersToRemove.push(pendingOrder);
          console.log(
            `At ${currentDeliveryDate} ${pendingOrder.id}(${pendingOrder.quantity}) is allocated`
          );
          allocations.push({
            id: allocations.length + 1,
            saleId: pendingOrder.id,
            deliveryDate: currentDeliveryDate,
          });
          currentSupply -= pendingOrder.quantity;
        } else {
          break;
        }
      }
      // Remove the orders that were allocated
      for (const order of ordersToRemove) {
        pendingOrders.splice(pendingOrders.indexOf(order), 1);
      }
    } else {
      // Check if this is the first sale order
      if (!initialSaleOrderDate) {
        initialSaleOrderDate = transaction.created;
      }
      // Check if there is supply available and no pending orders
      if (pendingOrders.length === 0 && transaction.quantity <= currentSupply) {
        // If available, allocate
        allocations.push({
          id: allocations.length + 1,
          saleId: transaction.id,
          deliveryDate: currentDeliveryDate,
        });
      } else {
        // Create pending order
        pendingOrders.push({
          quantity: transaction.quantity,
          id: transaction.id,
        });
      }
    }
  }
  return allocations;
}

function getOperationDate(op) {
  if (op.created) {
    return new Date(op.created).getTime();
  } else if (op.receiving) {
    return new Date(op.receiving).getTime();
  }
}

const allocations = allocate(salesOrders, purchaseOrders);
console.log(`Allocations`, allocations);
