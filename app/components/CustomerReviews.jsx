import { Rating } from "@mui/material";

export default function CustomerReviews() {
  const list = [
    {
      name: "Rahul Sharma - Class 10",
      message:
        "Score 100 books helped me score 95+ in my board exams! The PYQs and revision notes are amazing. Highly recommended for CBSE students.",
      rating: 5,
      imageLink:
        "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Priya Verma - Class 12",
      message:
        "Best question bank for board preparation. The mindmaps and cheat sheets made revision so easy. Scored 98 in Mathematics!",
      rating: 5,
      imageLink:
        "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Amit Patel - Class 11",
      message:
        "Excellent collection of previous year papers with detailed solutions. The competency-based questions are very helpful.",
      rating: 4.5,
      imageLink:
        "https://randomuser.me/api/portraits/men/67.jpg",
    },
  ];
  return (
    <section className="flex justify-center">
      <div className="w-full p-5 md:max-w-[900px] flex flex-col gap-3">
        <h1 className="text-center font-semibold text-xl">
          What Our Students Say
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {list?.map((item) => {
            return (
              <div className="flex flex-col gap-2 p-4 rounded-lg justify-center items-center border">
                <img
                  src={item?.imageLink}
                  className="h-32 w-32 rounded-full object-cover"
                  alt=""
                />
                <h1 className="text-sm font-semibold">{item?.name}</h1>
                <Rating
                  size="small"
                  name="customer-rating"
                  defaultValue={item?.rating}
                  precision={item?.rating}
                  readOnly
                />
                <p className="text-sm text-gray-500 text-center">
                  {item?.message}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
