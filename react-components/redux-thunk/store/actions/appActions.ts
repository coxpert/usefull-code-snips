import { AppDispatch } from "../index";

export const UPDATE_APP_ADDRESS = "UPDATE_APP_ADDRESS";

export const updateAddress = (address: string) => (dispatch: AppDispatch) => {
  dispatch({
    type: UPDATE_APP_ADDRESS,
    payload: address,
  });
};
