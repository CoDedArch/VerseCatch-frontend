import { useState, useEffect, useMemo } from "react";
import { UserRating } from "@/shared/constants/interfaceConstants";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Rating,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useUserData } from "@/shared/components/Hooks/useUserData";
import { RATING_URL, USER_STATS_URL } from "@/shared/constants/urlConstants";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

type RatingKey = 1 | 2 | 3 | 4 | 5;
type RatingFilter = "all" | "supporter" | "nonsupporter" | RatingKey;

type RatingDistribution = {
  [K in RatingKey]: number;
};

interface UserStats {
  total_users: number;
  users_with_ratings: number;
  rating_percentage: number;
  supporters_count: number;
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

const RatingDashboard = () => {
  const [users, setUsers] = useState<UserRating[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const { token } = useUserData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [ratingsResponse, statsResponse] = await Promise.all([
          fetch(RATING_URL, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(USER_STATS_URL, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (!ratingsResponse.ok || !statsResponse.ok) {
          throw new Error(`HTTP error! status: ${ratingsResponse.status}, ${statsResponse.status}`);
        }

        const [ratingsData, statsData] = await Promise.all([
          ratingsResponse.json(),
          statsResponse.json()
        ]);

        setUsers(ratingsData.users);
        setUserStats(statsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const ratingDistribution = useMemo(() => {
    const initialDistribution: RatingDistribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    return users.reduce(
      (acc: RatingDistribution, user: UserRating) => {
        if ([1, 2, 3, 4, 5].includes(user.rating)) {
          const ratingKey = user.rating as RatingKey;
          acc[ratingKey] += 1;
        }
        return acc;
      },
      { ...initialDistribution }
    );
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.feedback &&
          user.feedback.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesRating =
        ratingFilter === "all" ||
        (ratingFilter === "supporter" && user.is_supporter) ||
        (ratingFilter === "nonsupporter" && !user.is_supporter) ||
        (typeof ratingFilter === "number" && user.rating === ratingFilter);

      return matchesSearch && matchesRating;
    });
  }, [users, searchTerm, ratingFilter]);

  const handleRatingFilterChange = (value: string | number) => {
    if (value === "all" || value === "supporter" || value === "nonsupporter") {
      setRatingFilter(value);
    } else {
      const numValue = typeof value === "number" ? value : parseInt(value, 10);
      if ([1, 2, 3, 4, 5].includes(numValue)) {
        setRatingFilter(numValue as RatingKey);
      }
    }
  };

  const chartData = {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [{
      data: [
        ratingDistribution[1],
        ratingDistribution[2],
        ratingDistribution[3],
        ratingDistribution[4],
        ratingDistribution[5]
      ],
      backgroundColor: [
        '#ff6384',
        '#ff9f40',
        '#ffcd56',
        '#4bc0c0',
        '#36a2eb'
      ],
      borderWidth: 1,
    }],
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Analytics Dashboard
      </Typography>

      {/* Summary Cards */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <Paper sx={{ p: 2, minWidth: 180 }}>
          <Typography variant="subtitle2">Total Users</Typography>
          <Typography variant="h4">{userStats?.total_users || 0}</Typography>
        </Paper>
        <Paper sx={{ p: 2, minWidth: 180 }}>
          <Typography variant="subtitle2">Users Rated</Typography>
          <Typography variant="h4">{userStats?.users_with_ratings || 0}</Typography>
          <Typography variant="caption" color="text.secondary">
            ({userStats?.rating_percentage || 0}%)
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, minWidth: 180 }}>
          <Typography variant="subtitle2">Supporters</Typography>
          <Typography variant="h4">{userStats?.supporters_count || 0}</Typography>
        </Paper>
        {([1, 2, 3, 4, 5] as RatingKey[]).map((rating) => (
          <Paper key={rating} sx={{ p: 2, minWidth: 180 }}>
            <Typography variant="subtitle2">{rating} Star Ratings</Typography>
            <Typography variant="h4">{ratingDistribution[rating]}</Typography>
          </Paper>
        ))}
      </Box>

      {/* Visualization Section */}
      <Box display="flex" gap={3} mb={4} flexWrap="wrap">
        <Paper sx={{ p: 2, flex: 1, minWidth: 300 }}>
          <Typography variant="h6" gutterBottom>Rating Distribution</Typography>
          <Box height={300}>
            <Pie data={chartData} options={{ maintainAspectRatio: false }} />
          </Box>
        </Paper>
      </Box>

      {/* Filters */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          label="Search Users"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 250 }}
        />

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Rating Filter</InputLabel>
          <Select
            value={ratingFilter}
            onChange={(e) => handleRatingFilterChange(e.target.value)}
            label="Rating Filter"
          >
            <MenuItem value="all">All Ratings</MenuItem>
            <MenuItem value={5}>5 Stars</MenuItem>
            <MenuItem value={4}>4 Stars</MenuItem>
            <MenuItem value={3}>3 Stars</MenuItem>
            <MenuItem value={2}>2 Stars</MenuItem>
            <MenuItem value={1}>1 Star</MenuItem>
            <MenuItem value="supporter">Supporters</MenuItem>
            <MenuItem value="nonsupporter">Non-Supporters</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Main Table */}
      <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
        <Table stickyHeader aria-label="user ratings table">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell align="center">Rating</TableCell>
              <TableCell>Feedback</TableCell>
              <TableCell align="center">Verses Caught</TableCell>
              <TableCell align="center">Supporter</TableCell>
              <TableCell>Date Rated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <StyledTableRow key={user.id}>
                <TableCell>
                  <Typography fontWeight="medium">{user.user_name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <Rating value={user.rating} readOnly precision={0.5} />
                    <Typography variant="caption" color="text.secondary">
                      {user.rating_description}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  {user.feedback || (
                    <Typography color="text.secondary" fontStyle="italic">
                      No feedback provided
                    </Typography>
                  )}
                </TableCell>
                <TableCell align="center">{user.total_verses_caught}</TableCell>
                <TableCell align="center">
                  {user.is_supporter ? (
                    <Chip label="Yes" color="success" size="small" />
                  ) : (
                    <Chip label="No" color="default" size="small" />
                  )}
                </TableCell>
                <TableCell>
                  {new Date(user.rated_at).toLocaleString()}
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredUsers.length === 0 && (
        <Box mt={3} textAlign="center">
          <Typography color="text.secondary">
            No users match your filters
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default RatingDashboard;