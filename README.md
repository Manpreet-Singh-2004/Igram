# IGram
Your personal shopping center!

# Table of contents

- [IGram](#igram)
- [Table of contents](#table-of-contents)
- [Sign up](#sign-up)
   * [Problem as of 22-11-2025](#problem-as-of-22-11-2025)
- [Models](#models)
   * [User model](#user-model)
      + [Special case for clerkId GET](#special-case-for-clerkid-get)
      + [Special case for sellerId and productId](#special-case-for-sellerid-and-productid)
   * [Product Model](#product-model)
- [Image-Kit](#image-kit)
   * [Input Field change from URL to Image](#input-field-change-from-url-to-image)
   * [Handling Submit](#handling-submit)
   * [API](#api)
- [Routes / API folder](#routes-api-folder)
   * [onboarding/update](#onboardingupdate)
      + [Problems / future updates (22-11-2025)](#problems-future-updates-22-11-2025)
   * [users/[userId]](#usersuserid)
   * [product/seller/[sellerId]/](#productsellersellerid)
   * [api/upload-imagekit/route.js](#apiupload-imagekitroutejs)
- [Profile](#profile)
   * [Seller](#seller)
- [Components](#components)
   * [PersonalInformation](#personalinformation)

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

### Special case for sellerId and productId

**Users** have a `clerkId` (from Clerk authentication) and a MongoDB `_id` (created automatically by Mongoose).

```js
_id: ObjectId("...")   // MongoDB unique identifier
clerkId: "user_xxx"    // Clerk's auth ID
```
  **Products** have a `sellerId` field:
```js
sellerId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
}
```
This `sellerId` **stores the MongoDB `_id` of the user who is the seller**, not the `clerkId`.

**Why we do it this way:**

-   When a seller adds a product, the backend fetches the user by `clerkId` (from the authenticated user) and then stores **their MongoDB `_id`** in the `sellerId` field of the product.
    
-   Later, when fetching products for that seller, we query the `Product` collection using `sellerId`:

```js
Product.find({ sellerId: user._id })
```

So essentially:

-   `clerkId` → comes from Clerk (used to find the user in your database).
    
-   `sellerId` → MongoDB `_id` of that user, stored in the Product collection to know which seller owns it.


## Product Model

Just what we talks about above, sellerId is stored like this

```js
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
```

# Image-Kit
## Input Field change from URL to Image

Input Value was changed like this

```js
  <Input
    // onChange={(e) => setForm({ ...form, imagesURL: e.target.value })} This is changed from value to files
    type="file"
    accept="image/*"
    multiple
    // value={form.imagesURL}
    onChange={(e) => setForm({ ...form, imagesURL: Array.from(e.target.files) })}
  />
```

## Handling Submit

we basically added an endpoint 
```js
  const formData = new FormData();
  form.imagesURL.forEach((file) => formData.append("files", file));

  const uploadRes = await fetch("/api/upload-imagekit", {
        method: "POST",
        body: formData,
      });
  const {urls} = await uploadRes.json();

  console.log("Url Created | HandleSubmit")
```
And in the body of submission changed to urls
```js
// This is replaced with
    imagesURL: form.imagesURL.split(",").map((i) => i.trim()),
// This
    imagesURL: urls,
```

Check [api/upload-imagekit/route.js](#apiupload-imagekitroutejs) to see how it is sent to Image kit 

## API

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

## product/seller/[sellerId]/

Just like how we dealt with user, we again used 

```js
    const {sellerId} = await params;
    console.log("SellerId:", sellerId);
```

And since we wanted to create this to be shown at seller's own profile, we used `Product.find({sellerId})` 

## api/upload-imagekit/route.js

Since we are sending multiple files

```js
  const formData = await req.formData();
  const files = formData.getAll("files");
  const urls = [];
```

Then once the images are uploaded, imagekit sends the response back as a url

```js
    const upload = await imagekit.upload({
      file: buffer,
      fileName: file.name,
    });

      urls.push(upload.url);
    }
    console.log("Image URL sending | ImageKit API")
    return NextResponse.json({urls});
```
And then we upload the URL back to our DB. [Handling Submit](#handling-submit)


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

## Seller
To show Seller's product we used the useEffect like this 

```js
const res = await fetch(`/api/products/seller/${userData._id}`);
```

`useUser()` from clerk automatically passes gives the user, MongoDB user document contains `_id` 

Next.js sees [sellerId] in the route and gives the value to your API route:

```js
const { sellerId } = params;
```
and finally your query products with `Product.find({ sellerId })` → returns all products for that seller.

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
