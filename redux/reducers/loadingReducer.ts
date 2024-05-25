interface ILoadingState {
    isLoading: boolean;
  }
  
  // Define the initial state
  const initialLoadingState: ILoadingState = {
    isLoading: false,
  };
  
  // Define the action types
  enum ELoadingActionTypes {
    SET_LOADING = 'SET_LOADING',
  }
  
  interface ISetLoadingAction {
    type: ELoadingActionTypes.SET_LOADING;
    payload: boolean;
  }
  
  // Define the action creators
  export const setLoading = (isLoading: boolean): ISetLoadingAction => {
    return {
      type: ELoadingActionTypes.SET_LOADING,
      payload: isLoading,
    };
  };
  
  // Define the reducer
  export const loadingReducer = (
    state = initialLoadingState,
    action: ISetLoadingAction
  ): ILoadingState => {
    switch (action.type) {
      case ELoadingActionTypes.SET_LOADING:
        return {
          ...state,
          isLoading: action.payload,
        };
      default:
        return state;
    }
  };