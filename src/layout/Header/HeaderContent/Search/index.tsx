// material-ui
import { Box, FormControl, InputAdornment, OutlinedInput } from '@mui/material';

// assets
import { SearchOutlined } from '@ant-design/icons';
import {useTheme} from "@mui/material/styles";

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const Search = () => {
    const theme = useTheme();

    return (
        <Box sx={{ width: '100%', ml: { xs: 0, md: 1 } }} display="flex"  alignItems="center"
             justifyContent="center">
            <FormControl sx={{ width: { xs: '100%', md: 480 } }}>
                <OutlinedInput
                    size="medium"
                    id="header-search"
                    startAdornment={
                        <InputAdornment position="start" sx={{ mr: -0.5 }}>
                            <SearchOutlined />
                        </InputAdornment>
                    }
                    aria-describedby="header-search-text"
                    inputProps={{
                        'aria-label': 'weight'
                    }}
                    placeholder="Search..."
                />
            </FormControl>
        </Box>
    );
}

export default Search;