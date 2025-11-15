import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const id = params.id;

  // Construct base URL for API endpoints
  const curr_url = window.location.href;
  const root_url = curr_url.substring(0, curr_url.indexOf("postreview"));
  const dealer_url = root_url + `djangoapp/dealer/${id}`;
  const review_url = root_url + `djangoapp/add_review`;
  const carmodels_url = root_url + `djangoapp/get_cars`;

  // Fetch dealer info on mount
  useEffect(() => {
    const fetchDealer = async () => {
      try {
        const res = await fetch(dealer_url);
        if (res.ok) {
          const data = await res.json();
          setDealer(data);
        } else {
          console.error("Failed to fetch dealer info");
        }
      } catch (err) {
        console.error("Error fetching dealer info:", err);
      }
      setLoading(false);
    };

    const fetchCarModels = async () => {
      try {
        const res = await fetch(carmodels_url);
        if (res.ok) {
          const data = await res.json();
          setCarmodels(data);
        } else {
          console.error("Failed to fetch car models");
        }
      } catch (err) {
        console.error("Error fetching car models:", err);
      }
    };

    fetchDealer();
    fetchCarModels();
  }, [dealer_url, carmodels_url]);

  // Handle review post
  const postreview = async () => {
    let name = sessionStorage.getItem("firstname") + " " + sessionStorage.getItem("lastname");
    if (!name.trim()) {
      name = sessionStorage.getItem("username") || "Anonymous";
    }

    // Find selected car model object if model id is selected
    const selectedCar = carmodels.find(car => car.id === model) || {};

    const reviewData = {
      dealer_id: parseInt(id),
      name: name,
      review: review,
      purchase: date !== "",  // true if purchase date entered
      purchase_date: date,
      car_make: selectedCar.make || "",
      car_model: selectedCar.model || "",
      car_year: year,
    };

    console.log("Posting review data:", reviewData);

    try {
      const response = await fetch(review_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        alert("Review posted successfully!");
        // Clear form fields
        setReview("");
        setModel("");
        setYear("");
        setDate("");
      } else {
        alert("Failed to post review.");
      }
    } catch (error) {
      console.error("Error posting review:", error);
      alert("Error posting review.");
    }
  };

  if (loading) {
    return <div>Loading dealer information...</div>;
  }

  return (
    <div>
      <Header />
      <h2>Post a Review for {dealer.full_name || dealer.name}</h2>

      <div className="review-form">
        <label>
          Review:
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows="4"
            cols="50"
            placeholder="Write your review here"
          />
        </label>

        <label>
          Car Model:
          <select value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="">Select a car model</option>
            {carmodels.map((car) => (
              <option key={car.id} value={car.id}>
                {car.make} {car.model}
              </option>
            ))}
          </select>
        </label>

        <label>
          Year:
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year of the car"
          />
        </label>

        <label>
          Purchase Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <button onClick={postreview}>Post Review</button>
      </div>
    </div>
  );
};

export default PostReview;