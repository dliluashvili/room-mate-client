// import React from "react";

// export default function SmsCheck() {
//   return (
//     <>
//       <FormField
//         control={form.control}
//         name="phone"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>{t("Phonenumber")}</FormLabel>
//             <FormControl>
//               <PhoneInput
//                 labels={labels}
//                 inputComponent={BaseInput}
//                 defaultCountry="GE"
//                 international
//                 placeholder="Enter phone number"
//                 value={field.value}
//                 onChange={(phone) => {
//                   form.setValue("phone", phone);
//                 }}
//                 hasError={!!form.formState.touchedFields.phone}
//               />
//             </FormControl>
//             {form.formState.errors.phone && (
//               <FormMessage>{form.formState.errors.phone.message}</FormMessage>
//             )}
//           </FormItem>
//         )}
//       />

//       <BaseInput
//         type="number"
//         placeholder="ჩაწერე კოდი"
//         disabled={!form.formState.isValid}
//       />

//       <Button
//         variant="default"
//         size="default"
//         onClick={() => {
//           if (!form.formState.errors.phone) {
//             console.log("lado");
//           }
//         }}
//       >
//         {t("SMSsent")}
//       </Button>
//     </>
//   );
// }
