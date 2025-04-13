import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Theme } from "@/shared/constants/interfaceConstants";
import { ThemeState } from "@/shared/constants/interfaceConstants";
import { defaultTheme } from "@/shared/constants/varConstants";



const initialState: ThemeState = {
    currentTheme: JSON.parse(localStorage.getItem('currentTheme')|| JSON.stringify(defaultTheme)) 
}


export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<Theme>) => {
            state.currentTheme = action.payload;
            localStorage.setItem('currentTheme', JSON.stringify(action.payload));
        },
        resetTheme: (state) => {
            state.currentTheme = defaultTheme;
            localStorage.setItem('currentTheme', JSON.stringify(defaultTheme))
        }
    }
})

export const { setTheme, resetTheme } = themeSlice.actions;

export default themeSlice.reducer;