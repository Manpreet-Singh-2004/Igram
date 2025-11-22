# IGram
Your personal shopping center!

# Table of contents

# Sign up
As of now i am forcing a redirect after the clerk OAuth.

```js
<SignUp signUpForceRedirectUrl="/onboarding/customer" />
```
Since the default role is user hence i have made a additional form.
Clerk only passes `clerkId`, email, and name of the users. which is why i made an additional form for the user to enter their information that i need for my MongoDB.

I then use the Onboarding API to further pass the details of user to Mongo.

```js
    await fetch("/api/onboarding/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clerkId: user.id,
        name: fullName,
        email: user.primaryEmailAddress.emailAddress,
        phone,
        addresses: [address],
      }),
```

we are getting tihs information like user.id, primaryEmailAddress

## Problem as of 22-11-2025
Even when the User tries to log in, they are still redirected to onboarding page.

I am thinking to checking if the user already exist in our DB via email, since this cannot be done before the sign up page, i think i should do it on the onboarding page, which performs a check, if the user is found, then they are redirected to home page, otherwise they'll go through the onboarding.

# Models
## User model

Here we have created a single address line for both the user and seller

```js
const AddressSchema = new mongoose.Schema({
    label: {type: String, default: "Home"},
    country: {type: String, required: true},
    city: {type: String, required: true},
    postalCode: {type: String, required: true},
    streetAddress: {type: String, required: true}
});
```

and the seller will have additional properties like business Name and Business Address: 

```js
    sellerProfile: {
        businessName: String,
        businessAddress: AddressSchema,
    },
```

### Special case for clerkId GET
Additional Thing to notice is that we have used `select: false` for clerkId. It is recomended to keep this as select: false. because other wise the users can get this unwanted information.

```js
    clerkId: {
        type: String,
        required: true,
        unique: true,
        select: false,
    },
```

This has signifiance when you try to make a GET request.

meaning in our users/[userId]/route.js we have to pass in `.select("+clerkId")` because we are getting information based on this clerkId.

```js
    const user = await User.findOne({ clerkId: userId }).select("+clerkId");
```

# Routes / API folder

## onboarding/update

It is important to consider that i am more or less updating based on the clerkId.

getting information from onboarding page and passing it into this API and it is passed into DB

```js
    const updated = await User.findOneAndUpdate(
      { clerkId },
      { $set: rest },
      { new: true, upsert: true }
    );
```

### Problems / future updates (22-11-2025)

For the address, i am planning to use google maps to auto pick location and fill the fields.

## users/[userId]

One of the issues i came across was that in the new NextJs update the params are now a part of promises meaning they have to be used with await. so instead of using `const userId = params.userId` you have to first store it into another variable like i did with `IniParams` and then defragment it.

```js
    const IniParams = await params
    const userId = await IniParams.userId;
```

# Profile

```js
      try {
        const res = await fetch(`/api/users/${user.id}`, { cache: "no-store" });
        const data = await res.json();
        setUserData(data);
        console.log("Profile user data:", data);
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };
```
This function fetches from the API endpoint and passes parameters into PersonalInformation.jsx component

# Components
## PersonalInformation
The function saves the state and forwards to `PATCH` in user API endpoint

```js
  const handleSave = async () => {
    try {
      const res = await fetch(`/api/users/${userData._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const updated = await res.json();
      setUserData(updated);
      setForm(updated);
      setEditable(false);
    } catch (err) {
      console.error("Error saving Personal Info:", err);
    }
  };
```

Uses Alert Dialouge to ask before change, and this state `const [editable, setEditable] = useState(false);` to change the values.
