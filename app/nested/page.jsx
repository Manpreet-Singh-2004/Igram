import { create } from "zustand";
import { produce } from "immer";

const initialState = {
    user: {
        id: "user123",
        friends: ["jack", "jessica", "paul"],
        profile: {
            name: "John Doe",
            email: "john.doe@example.com",
            address: {
                street: "123 Main St",
                city: "NewYork",
                zipcode: "123456",
            },
        },
    },
};

export const useStore = create((set) =>({
    ...initialState,
    updateAddressStreet: (street) =>
        set(
            produce((state) =>{
                state.user.profile.address.street = street;
            })
        )
}));