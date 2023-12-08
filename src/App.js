import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddFriends, setShowAddFriends] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriends((showAddFriends) => !showAddFriends);
  }
  function handleAddFriends(newFriend) {
    setFriends((friends) => [...friends, newFriend]);
    setShowAddFriends(false);
  }

  function handleSelection(friend) {
    setSelectedFriend((selectedFriend) =>
      selectedFriend?.id === friend.id ? null : friend
    );
    setShowAddFriends(false);
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          myfriends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />

        {showAddFriends && (
          <FormAddFriends onHandleAddFriends={handleAddFriends} />
        )}

        <Button onClick={handleShowAddFriend}>
          {showAddFriends ? "Close" : "Add Friend"}{" "}
        </Button>
      </div>
      <div>
        {selectedFriend && (
          <FormSplitBill
            selectedFriend={selectedFriend}
            onSliptBill={handleSplitBill}
          />
        )}
      </div>
    </div>
  );
}

function FriendsList({ myfriends, onSelection, selectedFriend }) {
  return (
    <ul>
      {myfriends.map((friend) => (
        <Friend
          friendObj={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
        />
      ))}
    </ul>
  );
}

function Friend({ friendObj, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friendObj.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friendObj.image} alt={friendObj.name} />
      <h3>{friendObj.friend}</h3>

      {friendObj.balance < 0 && (
        <p className="red">
          You own {friendObj.name} {friendObj.balance} ₨
        </p>
      )}
      {friendObj.balance > 0 && (
        <p className="green">
          {friendObj.name} owes you {friendObj.balance} ₨
        </p>
      )}
      {friendObj.balance === 0 && (
        <p className="red">You and {friendObj.name} are even!</p>
      )}
      <Button onClick={() => onSelection(friendObj)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriends({ onHandleAddFriends }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=933348");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();

    const newFriend = { id, name, image: `${image}?=${id}`, balance: 0 };
    console.log(newFriend);

    onHandleAddFriends(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48?u=933348");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑Friends name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>🖼️ Image URL:</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSliptBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("");

  function handleSubmit2(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    onSliptBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit2}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💰Bill Value:</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>🦸‍♂️Your Expense:</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(Number(e.target.value)) > bill
            ? paidByUser
            : Number(e.target.value)
        }
      />
      <label>🧑‍🦲Friend Expense:</label>
      <input type="text" disabled value={paidByFriend} />
      <label> 😁Who is paying the bill?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
