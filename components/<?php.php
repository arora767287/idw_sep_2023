<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpFoundation\Response;

use League\Flysystem\AwsS3v3\AwsS3Adapter;
use Illuminate\Contracts\Filesystem\Filesystem;
use \GuzzleHttp\Client;
use Illuminate\Support\Facades\Validator;
use App\Models\MmEventLog;
use App\Models\QuestionBank;
//use Auth;


use File;
use Image;


class ApiController extends Controller
{
	 public function __construct(Request $req){
        $this->mmbase_url = config('app.mmbase_url');
        $this->mm_secret_key = config('app.mm_secret_key');
        $this->req = $req;
        $this->baseurl = 'https://beta-api.mmvpay.com/';
        $this->customer_id = 'zun8ouIMV2s72A3sQVAtYPiICwMihyVn';
        $this->product_key = 'sgidwgpr';
    }

   
    
    // Login API
        public function login(Request $request){
			
        $credentials = $request->only('email', 'password');
        //valid credential
        $validator = Validator::make($credentials, [
            'email' => 'required|email',
            'password' => 'required|string|min:6|max:50'
        ]); 

        //Send failed response if request is not valid
        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()], 200);
        }
        //Request is validated
        //Crean token
        try {
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Login credentials are invalid.',
                ], 400);
            }
        } catch (JWTException $e) {
            return response()->json([
                    'success' => false,
                    'message' => 'Could not create token.',
                ], 500);
        }
        if(auth()->user())
        {
            $user = auth()->user();
			if($user->current_location!=1){
			 $apiurl =$this->mmbase_url.'users';
			   $mmuser_id = $user->mm_user_id; 
			   
			  $curl = curl_init();
			  curl_setopt_array($curl, [
			  CURLOPT_URL => $apiurl,
			  CURLOPT_RETURNTRANSFER => true,
			  CURLOPT_ENCODING => "",
			  CURLOPT_MAXREDIRS => 10,
			  CURLOPT_TIMEOUT => 30,
			  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
			  CURLOPT_CUSTOMREQUEST => "GET",
              CURLOPT_POSTFIELDS => "",
			   CURLOPT_HTTPHEADER => ["Authorization: Basic ".$this->mm_secret_key."","Content-Type: application/json","X-Auth-User-ID:".$mmuser_id],
            ]);
			curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
			$response = json_decode(curl_exec($curl),true);
			}
			 $user->remember_token = $token;
                 $user->save();
            if($user->current_location==1){
				 if(($user->status==1)){
					  if($user->user_type==1){
					  return response()->json([
                            'status' => 1,
                            'code' =>200,
                            'user' => $user,
                            'token' => $token,
                            'message' => 'Login successfull'
                        ]);	  
					  }
				 }else{
				  return response()->json(['status'=>0,'message' => 'Account not activated!'], 200);	 
				 }
				
			}else{
            if(($user->status==1)){
				if(isset($response['description'])){
               if($response['description']=="User is currently inactive"){
					return response()->json([
                            'status' => 2,
                            'code' =>200,
							 'user' => $user,
                            'token' => $token,
                            'message' => 'MatchMove account is suspended and IDW account is deactivated'
                        ]);
				}else if($response['description']=="User record not found."){
					return response()->json([
                            'status' => 3,
                            'code' =>200,
							 'user' => $user,
                            'token' => $token,
                            'message' => 'MatchMove account is blocked and IDW account is deactivated'
                        ]);
			}}
               
                if($user->user_type==1){
                    //for mobile user
                    return response()->json([
                            'status' => 1,
                            'code' =>200,
                            'user' => $user,
                            'token' => $token,
                            'message' => 'Login successfull'
                        ]);
                    //login for mobile user conditions here
               
				}
            }else{
					if(isset($response['description'])){
               if($response['description']=="User is currently inactive"){
					return response()->json([
                            'status' => 2,
                            'code' =>200,
							 'user' => $user,
                            'token' => $token,
                            'message' => 'MatchMove account is suspended and IDW account is deactivated'
                        ]);
				}else if($response['description']=="User record not found."){
					return response()->json([
                            'status' => 3,
                            'code' =>200,
							 'user' => $user,
                            'token' => $token,
                            'message' => 'MatchMove account is blocked and IDW account is deactivated'
                        ]);
			}}
                    return response()->json(['status'=>0,'message' => 'Account not activated!'], 200);
                }
			}
        }
    
        }
    // Close

    // Reg API::
        public function registration(Request $request)
        {
			
            $data=$request->all();
            $data2=$request->all();
            $verification_key = md5(rand());
            $user_token=md5(uniqid(rand(), true));
            $email=$data['email'];

            $validator = Validator::make($request->all(), [
                'fname' => 'string|required|max:100',
                'lname' => 'string|required|max:100',
                'email' => 'bail|email|max:255|unique:users',
                'password' => 'required|min:6',
            ]);
        if ($validator->fails()) {
            return response()->json(['status'=>0,'message' => $validator->errors()->first()], 200);
        }

            if (!empty($data['phone'])) {
                if(preg_match('#[^0-9]#', trim($data['phone'])))
                {
                    return response()->json(['status'=>0,'message' => "Only numeric values allowed in mobile"], 200);
                }
            }
            if (!empty($data['fname'])) {
                if(!preg_match('/^[a-zA-Z\s]+$/', trim($data['fname'])))
                {
                    return response()->json(['status'=>0,'message' => "Only string and values allowed in first name"], 200);
                }
            }
            
            if (!empty($data['lname'])) {
                if(!preg_match('/^[a-zA-Z\s]+$/', trim($data['lname'])))
                {
                    return response()->json(['status'=>0,'message' => "Only string and values allowed in Last name"], 200);
                }
            }


            $user_exist=User::where('email',$email)->first();

            if(($user_exist)){
                return response()->json([
                    'status' => 2,
                    'status_code' => 201,
                    'message' => 'User Already Exist'
                ]); 
            }
            else{
                if(isset($data['country_code']))
                    {
                        $country_code = $data['country_code'];
                    }else{
                        $country_code = '65';
                    }
					if(isset($data['phone']))
                    {
                        $phone = $data['phone'];
                    }else{
                        $phone = '';
                    }
                if(isset($data['nationality_code']))
                    {
                        $nationality_code = $data['nationality_code'];
                    }else{
                        $nationality_code = '';
                    }
                 if(isset($data['id_type']))
                    {
                        $id_type = $data['id_type'];
                    }else{
                        $id_type = '';
                    }
                if(isset($data['id_number']))
                    {
                        $id_number = $data['id_number'];
                    }else{
                        $id_number = '';
                    }
                if(isset($data['title']))
                {
                    $title = $data['title'];
                }else{
                    $title = '';
                }
               
                if(isset($data['country_code']))
                    {
                        $country_code = $data['country_code'];
                    }else{
                        $country_code = '';
                    }  
				if(isset($data['termsandconditions']))
                    {
                        $termsandconditions = $data['termsandconditions'];
                    }else{
                        $termsandconditions = 1;
                    }if(isset($data['paypal_email']))
                    {
                        $paypal_email = $data['paypal_email'];
                    }else{
                        $paypal_email = $data['email'];
                    }

            if(isset($request->faceimage)){			
			$file = $request->faceimage;  // your base64 encoded
             $extension = explode('/', mime_content_type($file))[1];
			 $base64_str = substr($file, strpos($file, ",")+1);
                    $time = time();
                    $image = base64_decode($base64_str);
             $filename = md5(time())  . '.png';
			 $folder_path = 'Document';
            $path = $folder_path.'/'.$email.'/'. $filename;
         
        Storage::disk('s3')->put($path,$image,$filename);
		Storage::disk('s3')->setVisibility($path, 'public'); 
				}else{
			$filename ='';		
				}
				if(isset($data['coupon'])){
				 $code = $data['coupon'];
                 $matching = DB::table('coupons')->where('code', $code)->first();
				   if($matching->type == "1"){
                    $offer = DB::table('offer')->where('offer_id', $matching->offer_id) -> first();
                     if(!empty($offer)){
                if((strtotime($offer->start_date)>=strtotime(date('Y-m-d')))&&(strtotime($offer->end_date)<=strtotime(date('Y-m-d')))){
                    if($matching->used == "0"){
                        $coupon = DB::table('coupons')->where('code', $code)->update(['used'=>'1']); 
                    } 
                }
            }
                }else{
					if($matching->used == "0"){
               $coupon = DB::table('coupons')->where('code', $code)->update(['used'=>'1']); 
                $user = DB::table('users')->where('email', $matching->referee_email_id)->first();
                $num_referrals= $user->num_referrals;
				$num_referrals=+1;
                $update_user = DB::table('users') -> where('email', $matching->referee_email_id)->update(['num_referrals'=>$num_referrals]); 
				
				 $insertdb = DB::table('marketing_strategy')
                ->insertGetId([
                        'userid' => $user->id, 
                        'amount' => 10, 
                        'status' => "2", 
                        'type' => "2", 
                        'info' => "Coupon amount should pay"
                    ]); 
			
            }
				}
				}
                    if($data2['currentlocation']==1){
                               $result=DB::table('users')->insertGetId([ 
                                    'fname' => $data2['fname'],
                                    'lname' => $data2['lname'],   
                                    'gender' => $data2['gender'],   
                                    'email' => $email,
                                    'password' => bcrypt($data2['password']),
                                    'isd_code' => $country_code,
                                    'phone' => $phone,
                                    'verification_key' => $verification_key,
                                    'is_email_verified'=>'0',
                                    'status'=>'0',
                                    'company_id'=>'0',
                                    'user_type'=>'1',
                                    'prefered_name'=>$data2['fname'].' '.$data2['lname'],
                                    'mm_nationalities'=>$nationality_code,
                                    'mm_id_type'=>$id_type,
                                    'mm_id_number'=>$id_number,
                                    'user_token' => $user_token,
                                    'title' => $title,
                                    'terms_conditions' => $termsandconditions,
                                    'platform' => $data2['platform'],
                                    'paypal_email' => $paypal_email,
                                    'current_location' => $data2['currentlocation'],
                                    'coupon_status' => 0,
                                    'faceimage'=>$filename
                                ]);	
						$insertdb = DB::table('marketing_strategy')
						->insertGetId([
								'userid' => $result, 
								'amount' => 10, 
								'status' => "2", 
								'type' => "1", 
								'info' => "Join bonus amount should pay"
							]); 
					}else{
                        $curl = curl_init();
                        $data['first_name'] = $data['fname'];
                        $data['last_name'] = $data['lname'];
                        //$data['mobile_country_code'] = str_replace("+","",$country_code);
                        $data['mobile'] = $phone;
                        //$data['nationality'] = $nationality;
                        $data['preferred_name'] = $data['fname'].' '.$data['lname'];
                        $data['email'] = $data['email'];
                        $data['gender'] = $data['gender'];
                        $data['mobile_country_code'] = str_replace("+","",$country_code);
                        $data['password'] = $data['password'];
                        if(isset($data['title']))
                        {
                            $data['title'] = $data['title'];
                        }
                        if(isset($data['id_type'])){
                            $data['id_type'] = $data['id_type'];
                        }
                        $apiurl =$this->mmbase_url.'users';
                       

                       // \Log::info($apiurl);
                        //\Log::info($data);
                    try{

                        curl_setopt_array($curl, [
                          CURLOPT_URL => $apiurl,
                          CURLOPT_RETURNTRANSFER => true,
                          CURLOPT_ENCODING => "",
                          CURLOPT_MAXREDIRS => 10,
                          CURLOPT_TIMEOUT => 30,
                          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                          CURLOPT_CUSTOMREQUEST => "POST",
                          CURLOPT_POSTFIELDS => $data,
                          CURLOPT_HTTPHEADER => [
                            "Authorization: Basic ".$this->mm_secret_key."",
                            "Content-Type: multipart/form-data"
                          ],
                        ]);
                        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
                        $response = json_decode(curl_exec($curl),true);
                        //print_r("response".$response);
                            //   exit();
                        
                       // \Log::info($response);
                        $result = '';
                        
                        if(isset($response['id']))
                        {
				
                               $result=DB::table('users')->insertGetId([ 
                                    'fname' => $data2['fname'],
                                    'lname' => $data2['lname'],   
                                    'gender' => $data2['gender'],   
                                    'email' => $email,
                                    'password' => bcrypt($data2['password']),
                                    'isd_code' => $country_code,
                                    'phone' => $phone,
                                    'verification_key' => $verification_key,
                                    'is_email_verified'=>'0',
                                    'status'=>'0',
                                    'company_id'=>'0',
                                    'user_type'=>'1',
                                    'prefered_name'=>$data2['fname'].' '.$data2['lname'],
                                    'mm_nationalities'=>$nationality_code,
                                    'mm_id_type'=>$id_type,
                                    'mm_id_number'=>$id_number,
                                    'user_token' => $user_token,
                                    'title' => $title,
                                    'terms_conditions' => $termsandconditions,
                                    'platform' => $data2['platform'],
                                    'current_location' => $data2['currentlocation'],
									 'coupon_status' => 0,
                                    'faceimage'=>$filename
                                ]);

                            //update mm user id into identity wallet
                            //\Log::info('User ID-->>>');
                            //\Log::info($response['id']);
                            $userObj=User::where('email',$data['email'])->first();
                            $userObj->mm_user_id = $response['id'];
                            $userObj->save();
							$insertdb = DB::table('marketing_strategy')
							 ->insertGetId([
									'userid' => $result, 
									'amount' => 10, 
									'status' => "2", 
									'type' => "1", 
									'info' => "Join bonus amount should pay"
								]);
						
                        }else {
                            return $response;
                        }
                        $err = curl_error($curl);
                        curl_close($curl);
                        if ($err) {
                            return response()->json([
                                'status'=>1,
                                'status_code'=>200,
                                'message'=>'Something wen wrong!',
                                'error'=> $err
                            ]); 
                        }

                } catch (\Exception $e) {
                   return response()->json("Server down. Please try again later", 500);
                } 
					}

                if($result){

                    // Email functoion ::
                        $messageData=['first_name'=>$data['fname'],'last_name'=>$data['lname'],'user_token'=>$user_token];
                        $email_sent = Mail::send('email/contact-submission',$messageData,function($message) use($email){
                            $message->to($email)->subject('Registration Successfull');
                        });
                    // Close
                    if(Mail::failures()){
                        User::where(['user_token'=>$user_token])->update([
                            'email_sent'=>'0',
                        ]);
                        //DB::table('user')->where('id', $result)->update(['email_sent' => '0']);
                    }
                    else{
                        User::where(['user_token'=>$user_token])->update([
                            'email_sent'=>'1',
                        ]);
                        //DB::table('user')->where('id', $result)->update(['email_sent' => '1']);
                    }
                    return response()->json([
                        'status' => 1,
                        'status_code' => 200,
                        'message' => 'Thank for your registration. We sent an email to your mail account. please verify your email.'
                    ]);
                }
                else{
                    return response()->json([
                        'status' => 0,
                        'status_code' => 401,
                        'message' => 'Error in user Registration'
                    ]);
                } 

            }

        }
    // Close

    // Email Verify ::
        public function email_verify(Request $request)
        {   
            $conf_token=$_GET['conf_token'];
            User::where(['user_token'=>$conf_token])->update([
                'email_verified'=>1,
            ]);
            return view('email/email_verify');
        }
    // Close 

    // Profile Update API ::
        public function update_profile(Request $request){
            $id=$request->id;
            $result=DB::table('users')
                ->where('id', $id)
                ->update([
                    'fname'=> $request->fname,
                    'middle_name'=> $request->middle_name,
                    'lname'=> $request->lname,
                    'preferred_name'=> $request->preferred_name,
                    'dob'=> $request->dob,
                    'gender'=> $request->gender,
                    'isd_code'=> $request->isd_code,
                    'phone'=> $request->phone,
                    'address'=> $request->address,
                    'nationality'=> $request->nationality,
                    'marital_status'=> $request->marital_status,
                    'mother_maiden_name'=> $request->mother_maiden_name,
                    'income_year'=> $request->income_year,
                    'yearly_income'=> $request->yearly_income,
                    'industry' => $request->industry,
                    'school_attended' => $request->school_attended,
                    'city' => $request->city,
                    'country' => $request->country,
                    //'password'=>bcrypt($request->password)
                ]);

            if(($result))
            {
                return response()->json([
                    'status'=>1,
                    'status_code'=>200,
                    'message'=>'profile updated successfully',
                ]);
            }else{
                return response()->json([
                    'status'=>0,
                    'status_code'=>203,
                    'message'=>'profile not updated',
                ]);
            }
        }
    // Close


    // Get user detail by Id
        public function userDetailById(Request $request,$id='')
        {
            $id=$request->id;
            $user_detail = User::where('id',$id)->first();
            if (($user_detail))
                {
                    return response()->json([
                        'status'=>1,
                        'status_code'=>200,
                        'message'=>'record found',
                        'data'=> $user_detail
                    ]);
                }else{
                    return response()->json([
                        'status'=>0,
                        'status_code'=>203,
                        'message'=>'No record found',
                        'data'=>null
                    ]);
                }

        }
    // Close


    // User Specific folder Listing API
        public function getFolderName(Request $request,$id='')
        {
            $id = $request->id; 
            if(!empty($id)){
                $folderwith_user = DB::table('folder')->where([
                    ['user_id', '=', $id],
                    ['is_deleted', '=', '0'],
                ])->get()->toArray();
				   $folderwihtout_user = DB::table('folder')->where('user_id',0)->get()->toArray();
				$arr= array_merge($folderwihtout_user, $folderwith_user);
                return response()->json([
                        'status'=>1,
                        'status_code'=>200,
                        'message'=>'User folder found',
                        'data'=> $arr
                    ]);
            }else{
                //$folder_detail = DB::table('folder')->where('user_id',0)->get();
                return response()->json([
                    'status'=>2,
                    'status_code'=>201,
                    'message'=>'No record found',
                    'data'=> null
                ]);
            }
        }
    // Close
	// User Specific folder Listing API
        public function getAllFolder(Request $request)
        {
           
                $folder = DB::table('rec_docs')->get();
                return response()->json([
                        'status'=>1,
                        'status_code'=>200,
                        'message'=>'All folder List',
                        'data'=> $folder
                    ]);
           
        }
    // Close

			 public function combineWithKeys($array1, $array2)
			{
				foreach($array1 as $key=>$value) $array2[$key] = $value;
				asort($array2);
				return $array2;
			} 
    // General Folder Listing API
        public function getCommonFolder(Request $request)
        {
            $id = $request->id; 
            if($id==0){
                $folder_detail = DB::table('folder')->where('user_id',0)->get();
                return response()->json([
                        'status'=>1,
                        'status_code'=>200,
                        'message'=>'Common folders found',
                        'data'=> $folder_detail
                    ]);
            }else{
                //$folder_detail = DB::table('folder')->where('user_id',0)->get();
                return response()->json([
                    'status'=>2,
                    'status_code'=>201,
                    'message'=>'No record found',
                    'data'=> null
                ]);
            }
        }
    // Close

    // Folder Insert API
         public function insertFolder(Request $request,$id='')
        {
            $id=$request->id;
            $folder_name=$request->folder_name;

            if(!empty($id)){
                $folder_name_exist = DB::table('folder')
                                ->where('folder_name',$folder_name)
                                ->where('user_id',$id)->first();

                if(!empty($folder_name_exist)){
                    return response()->json([
                        'status'=>2,
                        'status_code'=>203,
                        'message'=>'Folder Already Exist',
                    ]);
                }  
                else{
                    $result=DB::table('folder')->insertGetId([ 
                        'folder_name' => $folder_name,
                        'is_standard' => '0',
                        'is_deleted'=> '0',
                        'user_id' => $id
                    ]);
                    if($result)
                    {   
                        $all_user_folder = DB::table('folder')
                                ->where('user_id',$id)->get();
                        return response()->json([
                            'status'=>1,
                            'status_code'=>200,
                            'message'=>'Folder Created Successfully',
                            'data'=> $all_user_folder
                        ]); 
                    }else{
                        return response()->json([
                            'status'=>3,
                            'status_code'=>204,
                            'message'=>'Folder Not Created',
                            'data'=> null
                        ]); 
                    }
                } 
            }
            else{
                return response()->json([
                    'status'=>4,
                    'status_code'=>205,
                    'message'=>'Something Went wrong',
                    'data'=> null
                ]); 
            }


        }
    // Close

      //Forgot password
    public function forgotPassword(Request $request){
        $user_name = $request->email;
        $user_active = User::where('email',$user_name)->first();

        $rules = array (
            'email' => 'required|email',
        );        
        $validator = Validator::make($request->all(), $rules);

        if($validator-> fails()){
            return response()->json([
                'status' => 0,
                'status_code' => 202,
                'message' => 'Please enter valid Email'
            ]);
        }elseif($user_active == "" || $user_active == null){
            
                return response()->json([
                    'status' => 2,
                    'status_code' => 203,
                    'message' => 'User does not exist'
                ]);
           
        }else{                   
            if ( $user_active->is_email_verified!=1){
				//$basecode=base64_decode($user_active->email);
                // Email functoion ::
                $messageData=['first_name'=>$user_active->fname,'last_name'=>$user_active->lname,'email'=>$user_name,'user_token'=>$user_active->user_token];
                $email_sent = Mail::send('email/verify_forgotpassword',$messageData,function($message) use($user_name){
                    $message->to($user_name)->subject('Email verification');
                });                
                // Close
                if(Mail::failures()){                    
                    return response()->json([
                        'status' => 3,
                        'status_code' => 204,
                        'message' => 'Email Verification Mail Failed'
                    ]);
                }
                else{                    
                    return response()->json([
                        'status' => 1,
                        'status_code' => 200,
                        'message' => 'Email Verification Mail sent Successfully'
                    ]);
                }
                
            }elseif($user_active && $user_active->is_email_verified==1){
                // add email logic here ...with change password link page.
              $basecode=base64_encode($user_active->id);
              // $url= "https://devidentitywallet.nityo.in/user-forget-password/".$basecode;
               $url= "https://identity-wallet.com/user-forget-password/".$basecode;
                User::where('email', $user_name)
                 ->update(array('forget_pwd_verify' => $basecode));
                  
                $messageData=array(
                    'first_name'=>$user_active->fname,
                    'last_name'=>$user_active->lname,
                    'username'=>$user_active->email,
                    'link'=>$url,
                    'LOGO_URL'=> env('LOGO_URL'),
                    'APP_URL'=> env('APP_URL')
                    //'subject'=>'Your Password has been changed successfully'
                 );                
                        
                $email_sent = Mail::send('email/forgot_password',$messageData,function($message) use($user_name){
                    $message->to($user_name)->subject('Identity Wallet - Forgot Password');
                });
                // Close
                if(Mail::failures()){
                    User::where('email',$user_name)->update([
                        'email_sent_forgot'=>'0',
                    ]);
                    
                    return response()->json([
                        'status' => 0,
                        'status_code' => 201,
                        'message' => 'Forgot Password Mail Failed'
                    ]);
                }
                else{
                    User::where('email',$user_name)->update([
                        'email_sent_forgot'=>'1',
                    ]);
                    
                    return response()->json([
                        'status' => 1,
                        'status_code' => 200,
                        'message' => 'Forgot Password Mail sent Successfully'
                    ]);
                }  
            }
        }
    }
    
     // Active Category List API
        public function getActiveCategories(Request $request)
        {
            $id = $request->id;
            $activeCategories = DB::table('category')->where('status',1)->get(); 

            $resArr = array();

            //check user prefrence
            $userpre = DB::table('user_preference')->where('user_id','=',$id)->where('status',1)->get(); 
            //\Log::info($userpre);
            //exit;
            if(!empty($userpre))
            {
                    $i = 0;
                    $j = 0;
                foreach($activeCategories as $category){
                        $resArr[$i]['Selected'] = 'Inactive';
                foreach($userpre as $preference) {
                    if($preference->category_id==$category->id)
                    {
                        if($preference->user_id==$id){
                            $resArr[$i]['Selected'] = 'Active';
                        }else{
                            $resArr[$i]['Selected'] = 'Inactive';
                        }
                       // $j++;
                    }
                            
                }
                    $resArr[$i]['id'] = $category->id;
                    $resArr[$i]['category_name'] = $category->category_name;
                    $resArr[$i]['parent_id'] = $category->parent_id;
                    $resArr[$i]['status'] = $category->status;
                    $i++;
                }
            }

            if(!empty($resArr)){
                
                return response()->json([
                        'status'=>1,
                        'status_code'=>200,
                        'message'=>'Active Categories List',
                        'data'=> $resArr
                    ]);
            }else{
                                
                return response()->json([
                    'status'=>0,
                    'status_code'=>200,
                    'message'=>'No Categories Available.',
                    'data'=> ''
                ]);
            }
        }

     //Set User Preference 
       public function setUserPreference(Request $request)
        {
            $user_id = $request->user_id;
            $category_id = $request->category_id;
            if($category_id !== ""){
                $category_idArray = explode(",", $category_id);
            }
            //print_r($category_idArray);exit();
            if(!empty($category_idArray)){
                DB::table('user_preference')->where('user_id', '=', $user_id)->delete(); 
                foreach ($category_idArray as &$categoryID) {
                    DB::table('user_preference')->insertGetId([ 
                        'category_id' => $categoryID,
                        'user_id' => $user_id,
                        'status'=> '1'
                    ]);
                }
                
                return response()->json([
                        'status'=>1,
                        'status_code'=>200,
                        'message'=>'Your preference updated in our system.',
                        'data'=> ''
                    ]);
            }else{
                                
                return response()->json([
                    'status'=>0,
                    'status_code'=>200,
                    'message'=>'Select at least 1 category for your preference.',
                    'data'=> ''
                ]);
            }
        } 

     //get User Folder Documents 
      public function userDocumentStorage(Request $request)
        {
            $user_id = $request->user_id;
            $folder_id = $request->folder_id;
            
            if(!empty($user_id) && !empty($folder_id)){
                $userDocuments = DB::table('user_document_storage')
                                    ->where('user_id',$request->user_id)
                                    ->where('folder_id',$request->folder_id)->get(); 
                $userDocCount = DB::table('user_document_storage')
                                    ->where('user_id',$request->user_id)
                                    ->where('folder_id',$request->folder_id)->count(); 

                if(!empty($userDocCount)){
                   return response()->json([
                        'status'=>1,
                        'status_code'=>200,
                        'message'=>'Specific Folder Document List',
                        'data'=> $userDocuments
                    ]); 
                }else{
                    return response()->json([
                        'status'=>1,
                        'status_code'=>200,
                        'message'=>'No Documents uploaded in this folder.',
                        'data'=> null
                    ]); 

                }                    
                
            }else{
                                
                return response()->json([
                    'status'=>0,
                    'status_code'=>200,
                    'message'=>'Required Parameters are missing.',
                    'data'=> null
                ]);
            }
        }
      
    //Delete file and folder
    public function deleteFolder(Request $request){
        $user_id = $request->user_id;        
        $folder_id = $request->folder_id;

        if(!$user_id || !$folder_id){
                return response()->json([
                                'status' => 0,
                                'status_code' => 201,
                                'message' => 'Invalid Input'
                            ]);
        }elseif($user_id && $folder_id){
            $user_id_db = DB::table('folder')->select('user_id')->where('id',$folder_id)->get();
            
            if($user_id_db->isEmpty()){
                return response()->json([
                                'status' => 2,
                                'status_code' => 202,
                                'message' => 'Invalid Input'
                            ]);
            }elseif($user_id && $user_id_db[0]->user_id != $user_id){
                return response()->json([
                                'status' => 3,
                                'status_code' => 203,
                                'message' => 'Access Denied'
                            ]);
            }else{
                $getfolderdata = DB::table('folder')->select('is_standard')->where('id',$folder_id)->get();
                if($getfolderdata[0]->is_standard != '1'){
                    $folderUpdate = DB::table('folder')
                            ->where('id', $folder_id)
                            ->update(['is_deleted'=>1]);
                    $fileinfolderUpdate = DB::table('user_document_storage')
                                            ->where('folder_id',$folder_id)
                                            ->update(['is_deleted'=>1]);

                    return response()->json([
                                'status' => 1,
                                'status_code' => 200,
                                'message' => 'Folder Archived'
                            ]);
                }else{
                    return response()->json([
                                'status' => 4,
                                'status_code' => 204,
                                'message' => 'Standard Folder can not be deleted'
                            ]);
                }
            }
        } 
    }
    //Close

    // Country List
    public function countryList(){
        $data = DB::table('countries')->select('*')->get();
        if($data->isEmpty()){
            return response()->json([
                            'status' => 0,
                            'status_code' => 201,
                            'message' => 'Not able to fetch country list',
                            'data' => null
                        ]);
        }else{
            return response()->json([
                            'status' => 1,
                            'status_code' => 200,
                            'message' => 'Country List',
                            'data' => $data
                        ]);
        }
    }
    // Close

    public function userProfile() {
        return response()->json(auth()->user());
    }

    //Delete file
    public function deleteFile(Request $request){
        $user_id = $request->user_id;
        $doc_id = $request->doc_id;
        $folder_id = $request->folder_id;

        if(!$user_id || !$doc_id || !$folder_id){
                return response()->json([
                                'status' => 0,
                                'status_code' => 201,
                                'message' => 'Invalid Input'
                            ]);
        }elseif($user_id && $doc_id && $folder_id){
            $check_doc_db = DB::table('user_document_storage')->select('user_id','folder_id','id')->where('id',$doc_id)->get();
            if($check_doc_db->isEmpty()){
                return response()->json([
                                'status' => 2,
                                'status_code' => 202,
                                'message' => 'Invalid Input'
                            ]);
            }elseif($check_doc_db[0]->user_id != $user_id || $check_doc_db[0]->folder_id != $folder_id || $check_doc_db[0]->id != $doc_id){
                return response()->json([
                                'status' => 6,
                                'status_code' => 206,
                                'message' => 'Access Denied'
                            ]);
            }else{
                $filedata = DB::table('user_document_storage')
                            ->where('id', $doc_id)
                            ->update(['is_deleted'=>1]);
                return response()->json([
                            'status' => 1,
                            'status_code' => 200,
                            'message' => 'File Deleted'
                        ]);
            }
        }
    }
    // Close

    //CMS page API
    public function getCmsPage(Request $request){
        $page_id = $request->page_id;
        if($page_id){
            $data = DB::table('cms_page')->select('*')->where('id',$page_id)->get();//->where('status',1)
        
            if($data->isEmpty()){
                return response()->json([
                                'status' => 0,
                                'status_code' => 201,
                                'message' => 'Not Data for CMS Page',
                                'data' => null
                            ]);
            }elseif($data[0]->status == 0){
                return response()->json([
                                'status' => 2,
                                'status_code' => 202,
                                'message' => 'CMS Page Inactive',
                                //'data' => $data
                            ]);
            }elseif($data[0]->status == 1){
                return response()->json([
                                'status' => 1,
                                'status_code' => 200,
                                'message' => 'CMS Content',
                                'data' => $data
                            ]);
            }
        }else{
            return response()->json([
                                'status' => 3,
                                'status_code' => 203,
                                'message' => 'Invalid Input',
                                'data' => null
                            ]);
        }
    }
    // Close

    // File List for a Folder
    public function getFileList(Request $request){
		
        $folder_id = $request->folder_id;
        $user_id = $request->user_id;
        //\Log::info($folder_id);
        if($folder_id){
            $data = DB::table('user_document_storage')
                    ->select('*')
                    ->where('user_id',$user_id)
                    ->where('folder_id',$folder_id)
                    ->where('is_deleted','0')
                    ->get();
            //\Log::info($data);
        
            if($data->isEmpty()){
                return response()->json([
                                'status' => 0,
                                'status_code' => 201,
                                'message' => 'Not Data for Documents',
                                'data' => null
                            ]);
            }else{
				$filepath = \Config::get('app.S3_FILEPATH');
				foreach($data as $dat){
             $path = $dat->folder_id.'/'.$dat->user_id.'/'.$dat->document_location;
			
			 $dat->path=$filepath.$path;
				}
                return response()->json([
                                'status' => 1,
                                'status_code' => 200,
                                'message' => 'Documents',
                                'data' => $data
                            ]);
            }
        }else{
            return response()->json([
                                'status' => 2,
                                'status_code' => 202,
                                'message' => 'Invalid Input',
                                'data' => null
                            ]);
        }
    } 
	// File List for a Folder
    public function getAllFileList(Request $request){
		
        $user_id = $request->user_id;
        //\Log::info($folder_id);
        if($user_id){
            $data = DB::table('user_document_storage')
                    ->select('*')
                    ->where('user_id',$user_id)
                    ->where('is_deleted','0')
                    ->get();
            //\Log::info($data);
        
            if($data->isEmpty()){
                return response()->json([
                                'status' => 0,
                                'status_code' => 201,
                                'message' => 'Not Data for Documents',
                                'data' => null
                            ]);
            }else{
				$filepath = \Config::get('app.S3_FILEPATH');
				foreach($data as $dat){
             $path = $dat->folder_id.'/'.$dat->user_id.'/'.$dat->document_location;
			
			 $dat->path=$filepath.$path;
				}
                return response()->json([
                                'status' => 1,
                                'status_code' => 200,
                                'message' => 'Documents',
                                'data' => $data
                            ]);
            }
        }else{
            return response()->json([
                                'status' => 2,
                                'status_code' => 202,
                                'message' => 'Invalid Input',
                                'data' => null
                            ]);
        }
    }
    // Close

    //Question Listing
    public function getQuestionListing(Request $request){
      
	  
	  $userid= $request->user_id;
		$data =  DB::table('question_bank')->select('id','keycode_id','question','question_mode','user_id')->where('user_id', $request->user_id)->where('is_standard','1')->get();
        if($data->isEmpty()){
                return response()->json([
                                'status' => 0,
                                'status_code' => 201,
                                'message' => 'Not Data for Questions',
                                'data' => null
                            ]);
            }else{
                return response()->json([
                                'status' => 1,
                                'status_code' => 200,
                                'message' => 'Question Listing',
                                'data' => $data
                            ]);
            }
    }
    public function statusFaceImage(Request $request){
        $username = $request->username;
        $data =User::where('email',$username)->first();
		if(isset($data)){

		 if(($data->status==1)){
			 
		 if($data->remember_token!=''){	
		 
		$filepath = \Config::get('app.S3_FILEPATH');
		$path=$filepath.$data['email'].'/'.$data['faceimage'];	
		$checkpath = substr($path, -3);
		 if($checkpath=="png"){
			 
        $data['faceimage'] = base64_encode(file_get_contents($path)); 
            return response()->json([
                                'status' => 1,
                                'status_code' => 200,
                                'message' => 'Username Available',
                                'data'=>$data
                            ]);
	     }
	    else
        {
            return response()->json([
                                'status' => 0,
                                'status_code' => 201,
                                'message' => 'No Username Available',
                                'data'=> null
                            ]);
            }  
			}
	    else
        {
            return response()->json([
                                'status' => 0,
                                'status_code' => 201,
                                'message' => 'Please login first before using face detection',
                                'data'=> null
                            ]);
            }  
			}
	    else
        {
            return response()->json([
                                'status' => 0,
                                'status_code' => 201,
                                'message' => 'Account not activated!',
                                'data'=> null
                            ]);
            } 	
			}
	    else
        {
            return response()->json([
                                'status' => 0,
                                'status_code' => 203,
                                'message' => 'No Username Available',
                                'data'=> null
                            ]);
            } 
    }
    // Close
    
    public function getAllCategoriesWithPreference(Request $request){
        
        $user_id = $request->user_id;
        $data = DB::table('category')
        ->select('category.id','category.category_name','user_preference.user_id')
        ->leftjoin('user_preference', function($join)
        {
            $join->on('category.id', '=', 'user_preference.category_id')
                 ->where('user_preference.user_id', '=', $user_id);
        })
        ->where('category.status','1')
        ->get();
        if($data->isEmpty()){
                return response()->json([
                                'status' => 0,
                                'status_code' => 201,
                                'message' => 'No Categories Existed.',
                                'data' => null
                            ]);
        }else{
            return response()->json([
                            'status' => 1,
                            'status_code' => 200,
                            'message' => 'Categories Listing with user preference.',
                            'data' => $data
                        ]);
        }
    }

    //get User's answer listing
    public function getUserAnswer(Request $request){
        $user_id = $request->user_id;
        $question_id = $request->question_id;       
        $is_interested = $request->is_interested;
        $question_type = DB::table('question_bank')->select('question_mode','keycode_id')->where('id',$question_id)->get();
        if($is_interested == "0"){
			$checkdata =  DB::table('user_questionbank_answer')->select('id')->where('user_id',$user_id)->where('questionbank_id',$question_id)->first();
        if(empty($checkdata)){
                    $insertNotInterested = DB::table('user_questionbank_answer')->insertGetId([               
                        'user_id' => $user_id,
                        'questionbank_id' => $question_id,
                        'answers_type' => $question_type[0]->question_mode,
                        'is_interested' => $is_interested,
                        'created_at' => date("Y-m-d H:m:s"),
                        'keycode_id' => $question_type[0]->keycode_id,
                        'status' => '1',
                        'answer' => null
                    ]);
		}else{
			 $result=DB::table('user_questionbank_answer')
                ->where('id', $checkdata->id)
                ->update([
                     'user_id' => $user_id,
                        'questionbank_id' => $question_id,
                        'answers_type' => $question_type[0]->question_mode,
                        'is_interested' => $is_interested,
						'updated_at' => date("Y-m-d H:m:s"),
						 'keycode_id' => $question_type[0]->keycode_id,
                        'status' => '1',
                        'answer' => null
                ]);
		}	
            $insertNotInterested = DB::table('user_questionbank_answer')->insertGetId([               
                        'user_id' => $user_id,
                        'questionbank_id' => $question_id,
                        'answers_type' => $question_type[0]->question_mode,
                        'is_interested' => $is_interested,
						'created_at' => date("Y-m-d H:m:s"),
						 'keycode_id' => $question_type[0]->keycode_id,
                        'status' => '1',
                        'answer' => null
                    ]);
            return response()->json([
                                'status' => 1,
                                'status_code' => 200,
                                'message' => 'Data Insert for User Not Interested',
                                'data' => ''
                            ]);
        }elseif($is_interested == "1"){
        
            if($request->answer){
                $answer = $request->answer;
				
			$checkdata =  DB::table('user_questionbank_answer')->select('id')->where('user_id',$user_id)->where('questionbank_id',$question_id)->first();
        if(empty($checkdata)){	
                $insertAnswer = DB::table('user_questionbank_answer')->insertGetId([                  
                            'user_id' => $user_id,
                            'questionbank_id' => $question_id,
                            'answers_type' => $question_type[0]->question_mode,
                            'is_interested' => $is_interested,
							'created_at' => date("Y-m-d H:m:s"),
							 'keycode_id' => $question_type[0]->keycode_id,
                            'status' => '1',
                            'answer' => $answer
                        ]);
		}else{
			 $result=DB::table('user_questionbank_answer')
                ->where('id', $checkdata->id)
                ->update([
                    'user_id' => $user_id,
                    'questionbank_id' => $question_id,
                    'answers_type' => $question_type[0]->question_mode,
                    'is_interested' => $is_interested,
					'updated_at' => date("Y-m-d H:m:s"),
					 'keycode_id' => $question_type[0]->keycode_id,
                    'status' => '1',
                    'answer' => $answer
                ]);
			
		}
                return response()->json([
                                'status' => 1,
                                'status_code' => 200,
                                'message' => 'User Answer Inserted',
                                'data' => ''
                            ]);
            }elseif($request->document){
                /*$request->validate([
                    'document' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                ]);*/
                $folder_path = 'Document/Question';
                $path = $folder_path.'/'.$user_id;
                //$path = 'Document/Personal/';
                $file = $request->document;
                //\Log::info($path);
                   $extension = explode('/', mime_content_type($file))[1];//\Log::info($extension);exit();
                    //$imageBase = 'data:image/jpg;base64,'.$file;
                    $base64_str = substr($file, strpos($file, ",")+1);
                    $time = time();
                    $image = base64_decode($base64_str);
                    //$extension ='png';
                    $filename =  md5(time() . rand(0, 5000)) . '.' . $extension;    
                    // original image upload file path
                    $imageName = $path . '/' . $filename;

                try {
                    Storage::disk('s3')->put($imageName,$image,$filename);                    
                    Storage::disk('s3')->setVisibility($imageName, 'public');
					
						$checkdata =  DB::table('user_questionbank_answer')->select('id')->where('user_id',$user_id)->where('questionbank_id',$question_id)->first();
         if(empty($checkdata)){
                    
                    $values = array('user_id' => $user_id,'questionbank_id' => $question_id,'answers_type' => $question_type[0]->question_mode,'is_interested' => $is_interested,'status' => '1','answer_filepath' => $imageName,'created_at' => date("Y-m-d H:m:s"));
                    DB::table('user_questionbank_answer')->insert($values);
		}else{
			 $result=DB::table('user_questionbank_answer')
                ->where('id', $checkdata->id)
                ->update([
                    'user_id' => $user_id,
                    'questionbank_id' => $question_id,
                    'answers_type' => $question_type[0]->question_mode,
                    'is_interested' => $is_interested,
					'updated_at' => date("Y-m-d H:m:s"),
                    'status' => '1',
                    'answer_filepath' => $imageName
                ]);
		}			

                    return response()->json([
                        'status' => 1,
                        'status_code' => 200,
                        'message' => 'File Uploaded for Question'
                    ]); 

                } catch (\Exception $e) {
                    return response()->json("Server down. Please try again later", 500);
                }
            }

        }else{
            return response()->json([
                        'status' => 0,
                        'status_code' => 201,
                        'message' => 'Invalid Inputs'
                    ]);
        }
    }
    // Close


    // Get Random Question
        public function getRandomQuestion(Request $request)
        {
            $user_id = $request->user_id;
            if($request->user_id=='' && !isset($request->user_id)){
                return response()->json([
                    'status' => 0,
                    'status_code' => 200,
                    'message' => 'Parameter(user-id) missing'
                    ]);  
            }

            $user = User::find($user_id);
            if($user){
                $data = DB::select("SELECT * FROM question_bank where status=1 and question_bank.id NOT IN (SELECT user_questionbank_answer.questionbank_id FROM user_questionbank_answer WHERE user_id = $user_id and is_interested=1)order by RAND() LIMIT 1");  
			//$data = DB::select("SELECT * FROM dev_identity_wallet.question_bank where id=3039");

                $resultArr = array();
                if($data){
                    $result = $data;
                    if($result[0]->keycode_id){
                        $resultArr[0]['keycode_id'] = $result[0]->keycode_id;
                        $resultArr[0]['question'] = $result[0]->question;
                        $resultArr[0]['question_mode'] = $result[0]->question_mode;

                        $resultArr[0]['is_standard'] = $result[0]->is_standard;
                        $resultArr[0]['id'] = $result[0]->id;
                        $qOptions = DB::table('questions_option')->select('id','option')->where('keycode_id',$result[0]->keycode_id)->get();
						if($result[0]->question_mode==7){
				$filepath = \Config::get('app.S3_FILEPATH');
				foreach($qOptions as $option){
					  $path = 'Question/'.'keycode_'.$result[0]->keycode_id.'/'.$option->option;  
			     $option->path=$filepath.$path;
				}
						}
			
                        if($qOptions){
                            $resultArr[0]['question_options'] = $qOptions;
                        }else{
                            $resultArr[0]['question_options'] = [];
                        }
                    
                    }else{
                        return response()->json([
                            'status' => 1,
                            'status_code' => 200,
                            'message' => 'Question limit cross',
                            'data' => ''
                        ]);
                    }

                }
            if($resultArr){
                return response()->json([
                'status' => 1,
                'status_code' => 200,
                'message' => 'Question Generated',
                'data' => $resultArr
                ]); 
            }else{
                return response()->json([
                'status' => 0,
                'status_code' => 201,
                'message' => 'Something Went wrong',
                'data' => null
                ]);  
            }

            }else{
                return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'incorrect user id'
                ]);  
            }
        
        }
    // Close


    public function deactivateMMuser()
    {
        if($this->req->id){
            $user = User::find($this->req->id);
            if(isset($user->mm_user_id) && $user->mm_user_id!=''){
				
		
            $mmuser_id = $user->mm_user_id;

            $apiurl =$this->mmbase_url.'users/'.$mmuser_id;
        try{
            $curl = curl_init();
              curl_setopt_array($curl, [
              CURLOPT_URL => $apiurl,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => "",
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => "DELETE",
              CURLOPT_POSTFIELDS => "",
              CURLOPT_HTTPHEADER => ["Authorization: Basic ".$this->mm_secret_key."","Content-Type: multipart/form-data"],
            ]);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $response = json_decode(curl_exec($curl),true);
            $err = curl_error($curl);
            curl_close($curl);
			$result=DB::table('users')
                ->where('id',$this->req->id)
                ->update([
                    'status'=> 0,
                ]);
            return $response;
        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }
            }else{
                return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Match Move user id missing'
                ]);  
            }
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);  
        }
                        

    } 


    public function getMMuser()
    {
        if($this->req->id){
            $user = User::find($this->req->id);
            if(isset($user->mm_user_id) && $user->mm_user_id!=''){
            $mmuser_id = $user->mm_user_id;
            $apiurl =$this->mmbase_url.'users';
			
        try{
            $curl = curl_init();
              curl_setopt_array($curl, [
              CURLOPT_URL => $apiurl,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => "",
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => "GET",
              CURLOPT_POSTFIELDS => "",
              CURLOPT_HTTPHEADER => ["Authorization: Basic ".$this->mm_secret_key."","Content-Type: application/json","X-Auth-User-ID:".$mmuser_id],
            ]);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $response = json_decode(curl_exec($curl),true);
            $err = curl_error($curl);
			
            return $response;
            curl_close($curl);
        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }
           
        }else{
                return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Match Move user id missing'
                ]);  
            }
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);  
        }
    }


    public function updateMMuser(Request $request)
    {
        /***************************************/
        $data=$this->req->all();

        $validator = Validator::make($request->all(), [
                'fname' => 'string|required|max:100',
                'lname' => 'string|required|max:100',
            ]);
        if ($validator->fails()) {
            return response()->json(['status'=>0,'message' => $validator->errors()->first()], 200);
        }

            if (!empty($data['phone'])) {
                if(preg_match('#[^0-9]#', trim($data['phone'])))
                {
                    return response()->json(['status'=>0,'message' => "Only numeric values allowed in mobile"], 200);
                }
            }
            if (!empty($data['fname'])) {
                if(!preg_match('/^[a-zA-Z\s]+$/', trim($data['fname'])))
                {
                    return response()->json(['status'=>0,'message' => "Only string and values allowed in first name"], 200);
                }
            }
            
            if (!empty($data['lname'])) {
                if(!preg_match('/^[a-zA-Z\s]+$/', trim($data['lname'])))
                {
                    return response()->json(['status'=>0,'message' => "Only string and values allowed in Last name"], 200);
                }
            }
            if (!empty($data['middle_name'])) {
                if(!preg_match('/^[a-zA-Z\s]+$/', trim($data['middle_name'])))
                {
                    return response()->json(['status'=>0,'message' => "Only string and values allowed in middle name"], 200);
                }
            }

        if($this->req->id){
            $user = User::find($this->req->id);
        if($user){
            if($user->mm_user_id){
            $mmuser_id = $user->mm_user_id;
            //$data2=$this->req->all();
            $apiurl =$this->mmbase_url.'users';

            
            $new_data = array();
           $fname = $data['fname'];
           if(isset($data['middle_name']))
            {
                $middle_name = $data['middle_name'];
            }else{
                $middle_name = '';
            }
            if(isset($data['lname']))
            {
                $lname = $data['lname'];
            }else{
                $lname = '';
            }
           // \Log::info($mmuser_id);

            if(isset($data['country_code']))
            {
                $country_code = $data['country_code'];
            }else{
                $country_code = '65';
            }
            $data_new['mobile_country_code'] = $country_code;
            if(isset($data['mobile'])){
                $mobile = $data['mobile'];
            }

            if(isset($data['nationality']))
            {
                $nationality = $data['nationality'];
            }else{
                $nationality = 'Singaporean';
            }
            
            //$data_new['preferred_name'] = $data['first_name'].' '.$data['last_name'];
            if(isset($data['email'])){
                $email = $data['email'];
            }
            if(isset($data['mobile_country_code'])){
                $mobile_country_code = $country_code;
            }else{
                $mobile_country_code = '65';
            }
            if(isset($data['password'])){
                $password = $data['password'];
            }
            
            if(isset($data['title']))
            {
                $title = $data['title'];
            }else{
                $title = '';
            }
            if(isset($data['id_type'])){
                $id_type = $data['id_type'];
            }else{
                $id_type = '';
            }
            if(isset($data['gender']))
            {
                $gender = $data['gender'];
            }else{
                $gender = '';
            }
            if(isset($data['marital_status']))
            {
                $marital_status = $data['marital_status'];
            }else{ $marital_status = '';}

            if(isset($data['countryofissue']))
            {
                $countryofissue = $data['countryofissue'];
            }else{
                $countryofissue = 'SGP';
            }
            if(isset($data['dob']))
            {
                $dob  = $data['dob'];
            }else{
                $dob = '';
            }

            if(isset($data['id_number']))
            {
                $id_number  = $data['id_number'];
            }else{
                $id_number = '';
            }          
            
            $update_data = "id=".$mmuser_id."&first_name=".$fname."&last_name=".$lname."&middle_name=".$middle_name."&title=".$title."&id_type=".$id_type."&id_number=".$id_number."&birthday=".$dob."&nationality=".$nationality."&gender=".$gender."&marital_status=".$marital_status."&country_of_issue=".$countryofissue."";
        try{
            $curl = curl_init();
              curl_setopt_array($curl, [
              CURLOPT_URL => $apiurl,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => "",
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => "PUT",
                CURLOPT_POSTFIELDS => $update_data,              
              CURLOPT_HTTPHEADER => [
                            "Authorization: Basic ".$this->mm_secret_key.'"',
                            "Content-Type: application/x-www-form-urlencoded",
                            "X-Auth-User-ID: ".$mmuser_id
                            ],
            ]);
            //\Log::info($this->req->id);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $response = json_decode(curl_exec($curl),true);
            $err = curl_error($curl);
            curl_close($curl);
            // if MM user api update response
            if(isset($response['id']))
            {
                $user->fname = $fname;
                $user->middle_name = $middle_name;
                $user->lname = $lname;
                if(isset($data['password'])){
                    $user->password = bcrypt($data['password']);
                }
                $user->dob = $dob;
                $user->gender = $gender;
                $user->isd_code = $data['isd_code'];
                $user->title = $title;
                $user->address = $data['address'];
                $user->income_year = $data['income_year'];
                $user->marital_status = $data['marital_status'];
                $user->industry = $data['industry'];
                $user->school_attended = $data['school_attended'];
                $user->yearly_income = $data['yearly_income'];
                $user->save();
                return response()->json([
                'status' => 1,
                'status_code' => 200,
                'message' => 'Profile updated successfully!'
                ]);  

            }else{
                return $response;
            }
        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }




             

            }else{
                return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'User not Exist'
                ]);
            }
            }else{
                return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'User not Exist'
                ]);
            }
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);  
        }
    }

    public function getMMUserAddress()
    {
        if($this->req->id){
            $user = User::find($this->req->id);
            if(isset($user->mm_user_id) && $user->mm_user_id!=''){
            $mmuser_id = $user->mm_user_id;

            $apiurl =$this->mmbase_url.'users/addresses/'.$this->req->type;
            $curl = curl_init();
              curl_setopt_array($curl, [
              CURLOPT_URL => $apiurl,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => "",
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => "GET",
              CURLOPT_POSTFIELDS => "",
              CURLOPT_HTTPHEADER => ["Authorization: Basic ".$this->mm_secret_key."","Content-Type: multipart/form-data","X-Auth-User-ID:".$mmuser_id],
            ]);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $response = json_decode(curl_exec($curl),true);
            $err = curl_error($curl);
            curl_close($curl);
            //\Log::info($response);
            return $response;
         }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Match move user-id missing'
                ]);  
        }
            
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);  
        }


    }

    public function getuserwallet()
    {
        if($this->req->id){
            $user = User::find($this->req->id);
            if(isset($user->mm_user_id) && $user->mm_user_id!=''){
            $mmuser_id = $user->mm_user_id;
            //\Log::info($this->req->mmuser_id);
            $apiurl =$this->mmbase_url.'users/wallets';
        try{
              $curl = curl_init();
              curl_setopt_array($curl, [
              CURLOPT_URL => $apiurl,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => "",
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => "GET",
              CURLOPT_POSTFIELDS => "",
              CURLOPT_HTTPHEADER => ["Authorization: Basic ".$this->mm_secret_key."","Content-Type: application/json","X-Auth-User-ID:".$mmuser_id],
            ]);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $response = json_decode(curl_exec($curl),true);
            $err = curl_error($curl);
            return $response;
            curl_close($curl);
        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }
        }else{
            response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'match move user id missing!'
                ]);
        }            
             
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);  
        }
    } 


    public function createWallet()
    {
	
        if($this->req->id){
            $user = User::find($this->req->id);
            if(isset($user->mm_user_id) && $user->mm_user_id!=''){
            $mmuser_id = $user->mm_user_id;
            $curl = curl_init();
            $apiurl =$this->mmbase_url.'users/wallets';
            /*\Log::info($mmuser_id);\Log::info($apiurl);
            \Log::info($this->mm_secret_key);*/
        try{
            curl_setopt_array($curl, [
              CURLOPT_URL => $apiurl,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => "",
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => "POST",
              CURLOPT_POSTFIELDS => "",
              CURLOPT_HTTPHEADER => [
                "Authorization: Basic ".$this->mm_secret_key.'"',
                "Content-Type: application/json","X-Auth-User-ID:".$mmuser_id
              ],
            ]);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $response = json_decode(curl_exec($curl),true);
			print_r($response);
            $err = curl_error($curl);
            if(!$err){
                if(isset($response['id']))
                {
                    DB::table('users')->where(['id'=>$this->req->id])->update(array('mm_wallet_check'=>'1'));
                    return $response;
                }else {
                    return $response;
                }
            }else{
              return $err;
            }
            
            curl_close($curl);
        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }

        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Match Move id missing'
                ]); 
        }
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);  
        }
                        
    }
// Get configured card types
    public function getWalletCardType()
    {
        $apiurl =$this->mmbase_url.'users/wallets/cards/types';
        try{
            $curl = curl_init();
            curl_setopt_array($curl, [
              CURLOPT_URL => $apiurl,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => "",
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => "GET",
              CURLOPT_POSTFIELDS => '',
              CURLOPT_HTTPHEADER => [
                "Authorization: Basic ".$this->mm_secret_key.'"',
                "Content-Type: application/json"
              ],
            ]);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $response = json_decode(curl_exec($curl),true);
            $err = curl_error($curl);
            if(!$err){
              return $response;
            }else{
              return $err;
            }
        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }
            
    }

    //get card for user
    public function getUserWalletCard(Request $request)
    {
        //\Log::info(\Auth::user());
        //$this->req->id = ;
        //\Log::info('this is test log');
        //\Log::info($request->all());
		
        if($this->req->id){
            $user = User::find($this->req->id);
        if(isset($user->mm_user_id) && $user->mm_user_id!=''){
            $mmuser_id = $user->mm_user_id;
           // \Log::info($this->req->card_id);
        $apiurl =$this->baseurl.$this->product_key.'/v1/users/wallets/cards/';
        try{
                $curl = curl_init();
                curl_setopt_array($curl, [
                  CURLOPT_URL => $apiurl,
                  CURLOPT_RETURNTRANSFER => true,
                  CURLOPT_ENCODING => "",
                  CURLOPT_MAXREDIRS => 10,
                  CURLOPT_TIMEOUT => 30,
                  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                  CURLOPT_CUSTOMREQUEST => "GET",
                  CURLOPT_POSTFIELDS => '',
                  CURLOPT_HTTPHEADER => [
                    "Authorization: Basic ".$this->mm_secret_key.'"',
                    "Content-Type: application/json","X-Auth-User-ID:".$mmuser_id
                  ],
                ]);
                curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
                $response = json_decode(curl_exec($curl),true);
                $err = curl_error($curl);
                if(!$err){
                  return $response;
                }else{
                  return $err;
                }
         } catch (\Exception $e) {
                return response()->json("Server down. Please try again later", 500);
            }
           
            }else{
                response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Match move id is missing!'
                ]); 
            }
            
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);  
        }        
    }

//upload KYC Documents // not userd in app
    public function uploadKycDoc()
    {
        if($this->req->mmuser_id && $this->req->data){
            $apiurl =$this->baseurl.$this->product_key.'/v1/users/authentications/documents';
            //\Log::info($this->req->data);
            $curl = curl_init();
            curl_setopt_array($curl, [
              CURLOPT_URL => $apiurl,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => "",
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => "POST",
              CURLOPT_POSTFIELDS => $this->req->data,
              CURLOPT_HTTPHEADER => [
                "Authorization: Basic".$this->mm_secret_key."",
                "Content-Type: multipart/form-data","X-Auth-User-ID:".$this->req->mmuser_id
              ],
            ]);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $response = json_decode(curl_exec($curl),true);
            //\Log::info('Response---');
            //\Log::info($response);

            $err = curl_error($curl);
           
            curl_close($curl);
                if(isset($response['id']))
                {
                    return $response;
                }else {
                    return $response;
                }
                   
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);  
        }
                        
    }
//Get KYC Submission Status
public function getKycStatus()
    {
        if($this->req->id){
            $user = User::find($this->req->id);
        if(isset($user->mm_user_id) && $user->mm_user_id!=''){
            $mmuser_id = $user->mm_user_id;
            //\Log::info($mmuser_id);
            $apiurl =$this->baseurl.$this->product_key.'/v1/users/authentications/documents';
            try{
                $curl = curl_init();
                  curl_setopt_array($curl, [
                  CURLOPT_URL => $apiurl,
                  CURLOPT_RETURNTRANSFER => true,
                  CURLOPT_ENCODING => "",
                  CURLOPT_MAXREDIRS => 10,
                  CURLOPT_TIMEOUT => 30,
                  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                  CURLOPT_CUSTOMREQUEST => "GET",
                  //CURLOPT_POSTFIELDS => "",
                  CURLOPT_HTTPHEADER => [
                    "Authorization: Basic ".$this->mm_secret_key.'"',"Content-Type: application/json","X-Auth-User-ID:".$mmuser_id
                  ],
                    ]);
                curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
                $response = json_decode(curl_exec($curl),true);
                $err = curl_error($curl);
                return $response;
                curl_close($curl);
            } catch (\Exception $e) {
                return response()->json("Server down. Please try again later", 500);
            }
           
            }else{
                response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Match move id is missing!'
                ]); 
            }
            
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);  
        }
    }

//create card mm api
    public function createCard()
    {
        if($this->req->id){
            $user = User::find($this->req->id);
        if(isset($user->mm_user_id) && $user->mm_user_id!=''){
			
			if($user->ekyc_status==2){
            $mmuser_id = $user->mm_user_id;
            //$data2=$this->req->all();
            //sandbxmccard
            $apiurl =$this->baseurl.$this->product_key.'/v1/users/wallets/cards/idwgprmccard';
            try{
              $curl = curl_init();
              curl_setopt_array($curl, [
              CURLOPT_URL => $apiurl,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => "",
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => "POST",
              //CURLOPT_POSTFIELDS => "assoc_number=&ref_id=&card_design=&name_on_card=&additional_details=&auto_activate=true&2fa_method=&2fa_delivery=".$fdelivery."&2fa_value=",

              CURLOPT_POSTFIELDS => "auto_activate=true",              
              CURLOPT_HTTPHEADER => [
                            "Authorization: Basic ".$this->mm_secret_key.'"',
                            "Content-Type: application/x-www-form-urlencoded",
                            "X-Auth-User-ID: ".$mmuser_id
                            ],
            ]);
            //\Log::info($this->req->id);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $response = json_decode(curl_exec($curl),true);
            $err = curl_error($curl);
            //\Log::info($response);\Log::info($err);
            return $response;
            curl_close($curl);
        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }

        }else{
                 return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Accept KYC Verification. Before Create Card'
                ]);

            }  
		}else{
                 return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'MM userid missing'
                ]);

            }
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]); 
        }
    }

   // Get card details
    public function getCardResetPin()
    {
        if($this->req->id){
            $user = User::find($this->req->id);
        if(isset($user->mm_user_id) && $user->mm_user_id!=''){
        //\Log::info($this->req->card_id);
        $apiurl =$this->baseurl.$this->product_key.'/v1/users/wallets/cards/'.$this->req->card_id.'/pins/reset?mode=S';
        try{
            $curl = curl_init();
            curl_setopt_array($curl, [
              CURLOPT_URL => $apiurl,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => "",
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => "GET",
             // CURLOPT_POSTFIELDS => 'card_id='.$this->req->card_id.'&mode=s',
              CURLOPT_HTTPHEADER => [
                "Authorization: Basic ".$this->mm_secret_key.'"',
                "Content-Type: application/json"
              ],
            ]);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $response = json_decode(curl_exec($curl),true);
            $err = curl_error($curl);
            if(!$err){
              return $response;
            }else{
              return $err;
            }

        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }

        }else{
                 return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'MM userid missing'
                ]);

            }
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]); 
        }       
}

//Re-activate card
    public function reActivateCard()
    {
        if($this->req->card_id)
        {
            $card_id = $this->req->card_id;
        }else{
            return response()->json(['status' => 0,'status_code' => 403,'message' => 'card id missing']);
        }
        $apiurl =$this->baseurl.$this->product_key.'/v1/users/wallets/cards/'.$card_id;
        try{
            $curl = curl_init();
            curl_setopt_array($curl, [
              CURLOPT_URL => $apiurl,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => "",
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => "POST",
              CURLOPT_POSTFIELDS => 'id='.$card_id,
              CURLOPT_HTTPHEADER => [
                            "Authorization: Basic ".$this->mm_secret_key.'"',
                            "Content-Type: application/x-www-form-urlencoded"
                            ],
            ]);
            //,"X-Auth-User-ID:".$this->req->mmuser_id
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $response = json_decode(curl_exec($curl),true);
            $err = curl_error($curl);
            if(!$err){
              return $response;
            }else{
              return $err;
            }
        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }

    }

    public function activatedCard()
    {
        if($this->req->card_id)
        {
            $card_id = $this->req->card_id;
        }else{
            return response()->json(['status' => 0,'status_code' => 403,'message' => 'card id missing']);
        }
        //\Log::info($this->req->card_id);
        $apiurl =$this->baseurl.$this->product_key.'/v1/users/wallets/cards/'.$card_id;
        try{
            $curl = curl_init();
            curl_setopt_array($curl, [
              CURLOPT_URL => $apiurl,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => "",
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => "POST",
              CURLOPT_POSTFIELDS => 'id='.$card_id,
              CURLOPT_HTTPHEADER => [
                            "Authorization: Basic ".$this->mm_secret_key.'"',
                            "Content-Type: application/x-www-form-urlencoded"
                            ],
            ]);
            //,"X-Auth-User-ID:".$this->req->mmuser_id
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $response = json_decode(curl_exec($curl),true);
            //\Log::info('Response---');\Log::info($response);

            $err = curl_error($curl);
            if(!$err){
              return $response;
            }else{
              return $err;
            }
        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }

    }

//Suspend / Block card

    public function suspendCard()
    {
        //\Log::info($this->req->card_id);
        if($this->req->id!='' && $this->req->card_id!=''){
            $user = User::find($this->req->id);
        if(isset($user->mm_user_id) && $user->mm_user_id!=''){
            $mmuser_id = $user->mm_user_id;

        $apiurl =$this->baseurl.$this->product_key.'/v1/users/wallets/cards/'.$this->req->card_id;
        try{
            $curl = curl_init();
            curl_setopt_array($curl, [
              CURLOPT_URL => $apiurl,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => "",
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => "DELETE",
              CURLOPT_HTTPHEADER => [
                        "Authorization: Basic ".$this->mm_secret_key.'"',
                            "Content-Type: application/x-www-form-urlencoded",
                            "X-Auth-User-ID: ".$mmuser_id
                            ],
            ]);
            //,"X-Auth-User-ID:".$this->req->mmuser_id
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $response = json_decode(curl_exec($curl),true);
            //\Log::info('Response---');
            //\Log::info($response);
            $err = curl_error($curl);
           if(!$err){
              return $response;
            }else{
              return $err;
            }
        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }

        }else{
                 return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'MM userid missing'
                ]);

            }
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing(id/card_id)'
                ]); 
        }
    }

    public function getCardDetail(Request $request)
    {
        if($request->input('id')!='' && $request->input('card_id')){
            $user = User::find($request->input('id'));
        if(isset($user->mm_user_id) && $user->mm_user_id!=''){
            $mmuser_id = $user->mm_user_id;
            //$this->req->cardno = 'd64720aba55f1f47c27fa3c1a707127d';
            //sandbxmccard
            $apiurl =$this->baseurl.$this->product_key.'/v1/users/wallets/cards/'.$request->input('card_id');
                try{
                    $curl = curl_init();
                      curl_setopt_array($curl, [
                      CURLOPT_URL => $apiurl,
                      CURLOPT_RETURNTRANSFER => true,
                      CURLOPT_ENCODING => "",
                      CURLOPT_MAXREDIRS => 10,
                      CURLOPT_TIMEOUT => 30,
                      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                      CURLOPT_CUSTOMREQUEST => "GET",
                      CURLOPT_HTTPHEADER => [
                                    "Authorization: Basic ".$this->mm_secret_key.'"',
                                    "Content-Type: application/x-www-form-urlencoded",
                                    "X-Auth-User-ID: ".$mmuser_id
                                    ],
                    ]);
                    //\Log::info($this->req->id);
                    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
                    $response = json_decode(curl_exec($curl),true);
                    $err = curl_error($curl);
                    return $response;
                    curl_close($curl);
                } catch (\Exception $e) {
                    return response()->json("Server down. Please try again later", 500);
                }
            }else{
                 return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'MM userid missing'
                ]);

            }
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing(id/card_id)'
                ]); 
        }
    }

    public function reActivateCardDetail()
    {
        if($this->req->id!='' && $this->req->card_id!=''){
             $user = User::find($this->req->id);
        if(isset($user->mm_user_id) && $user->mm_user_id!=''){
            $mmuser_id = $user->mm_user_id;
            $apiurl =$this->baseurl.$this->product_key.'/v1/users/wallets/cards/'.$this->req->card_id;
        try{
            $curl = curl_init();
              curl_setopt_array($curl, [
              CURLOPT_URL => $apiurl,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => "",
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => "PUT",
              //CURLOPT_POSTFIELDS => "assoc_number=&ref_id=&card_design=&name_on_card=&additional_details=&auto_activate=true&2fa_method=&2fa_delivery=".$fdelivery."&2fa_value=",
            CURLOPT_POSTFIELDS => "id=".$this->req->card_id,              
              CURLOPT_HTTPHEADER => [
                        "Authorization: Basic ".$this->mm_secret_key.'"',
                        "Content-Type: application/x-www-form-urlencoded",
                        "X-Auth-User-ID: ".$mmuser_id],
            ]);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $response = json_decode(curl_exec($curl),true);
            $err = curl_error($curl);
           //\Log::info($response);
            return $response;
            curl_close($curl);
        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }
            }else{
                    return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'MM userid missing'
                ]);
            }
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing id(user_id)/card_id'
                ]);
        }
    }

    public function kycProviders()
    {
        $apiurl =$this->baseurl.$this->product_key.'/v1/oauth/consumer/kyc/providers';
        try{
            $curl = curl_init();
              curl_setopt_array($curl, [
              CURLOPT_URL => $apiurl,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => "",
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => "GET",
            ]);
            //\Log::info($this->req->id);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $response = json_decode(curl_exec($curl),true);
            $err = curl_error($curl);
            //\Log::info($response);
            //\Log::info($err);
            curl_close($curl);
            return $response;
        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }          
    }
  public function confirmKYCVerification(Request $request){
        if($this->req->id!=''){
            $user = User::find($this->req->id);
            if(isset($user->mm_user_id) && $user->mm_user_id!=''){
                $mmuser_id = $user->mm_user_id;
                $apiurl =$this->baseurl.$this->product_key.'/v1/users/authentications/documents/process';
                if(isset($user -> verification_id) && $user->verification_id != ''){
                    $verification_id = $user->verification_id; 
                    $program_code = 'MUAISPONMEJTB12810';
                    try{
                        $curl = curl_init();
                        curl_setopt_array($curl, [
                        CURLOPT_URL => $apiurl,
                        CURLOPT_RETURNTRANSFER => true,
                        CURLOPT_ENCODING => "",
                        CURLOPT_MAXREDIRS => 10,
                        CURLOPT_TIMEOUT => 30,
                        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                        CURLOPT_CUSTOMREQUEST => "PUT",
                            CURLOPT_POSTFIELDS => "verification_id=".$verification_id."&program_code=".$program_code,
                        CURLOPT_HTTPHEADER => [
                                    "Authorization: Basic ".$this->mm_secret_key.'"',
                                    "Content-Type: application/x-www-form-urlencoded"],
                        ]);
                        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
                        $response = json_decode(curl_exec($curl),true);
                        $err = curl_error($curl);
                        curl_close($curl);
                        $response["status"] = 4;
                        return $response;
                    
                    } catch (\Exception $e) {
                        return response()->json("Server down. Please try again later", 500);
                    }
                } else {
                    return response()->json([
                        'status' => 1,
                        'status_code' => 400,
                        'message' => 'User has not started KYC Verification yet'
                        ]); 
                }
            }else{
                return response()->json([
                    'status' => 2,
                    'status_code' => 401,
                    'message' => 'match move user id is missing'
                    ]); 
            }
    }else{
        return response()->json([
                'status' => 3,
                'status_code' => 402,
                'message' => 'Parameter user id is missing'
                ]); 
    }
    }
    public function eKYCVerification(Request $request)
    {
        if($this->req->id!=''){
            $user = User::find($this->req->id);
        if(isset($user->mm_user_id) && $user->mm_user_id!=''){
            $mmuser_id = $user->mm_user_id;
         $apiurl =$this->baseurl.$this->product_key.'/v1/users/authentications/documents/process';
            //$fdelivery= '9958045815';
            $provider_id = 'pvd_6e4adecc8cc74220a67b8766d879715a';
            $program_code = 'MUAISPONMEJTB12810';
        try{
            $curl = curl_init();
              curl_setopt_array($curl, [
              CURLOPT_URL => $apiurl,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => "",
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => "POST",
                CURLOPT_POSTFIELDS => "provider_id=".$provider_id."&user_type=customer&user_id=".$mmuser_id."&program_code=".$program_code,
            CURLOPT_HTTPHEADER => [
                        "Authorization: Basic ".$this->mm_secret_key.'"',
                        "Content-Type: application/x-www-form-urlencoded"],
            ]);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $response = json_decode(curl_exec($curl),true);
            $err = curl_error($curl);
            //\Log::info($response);
            curl_close($curl);
			if( isset($response['success'])){
           DB::table('users')
                ->where('id', $this->req->id)
                ->update([
                   'ekyc_status'=>2,
                ]);
				$res = User::find($this->req->id);
			 return $res; 
			}else{
				 return $response; 
			}
           
        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }
            }else{
                return response()->json([
                    'status' => 0,
                    'status_code' => 200,
                    'message' => 'match move id is missing'
                    ]); 

            }
        }else{
            return response()->json([
                    'status' => 0,
                    'status_code' => 200,
                    'message' => 'Parameter missing'
                    ]); 
        }
    }

    // call update mm user residential address
    public function updateUserAddress()
    {
        if($this->req->id!=''){
            $user = User::find($this->req->id);
        if(isset($user->mm_user_id) && $user->mm_user_id!=''){
            $mmuser_id = $user->mm_user_id;
         if($this->req->type)
         {
            $type = $this->req->type;
         }else{
             $type = 'residential';
         }
         $apiurl =$this->mmbase_url.'users/addresses/'.$type;
         //\Log::info($apiurl);
            $add1 = $this->req->address_1;// = '50';
            $add2 = $this->req->address_2;// = 'Lorong Lorong';
            $city = $this->req->city;// = 'Lorong Lorong';
            $state = $this->req->state;// = 'Singapore';
            $country = $this->req->country;// = 'Singapore';
            $country_code = $this->req->country_code;// = 'SGP';
            $zipcode = $this->req->zipcode;// = '399999';
            if($zipcode=='')
            {
                $zipcode = '399999';
            }
            //\Log::info($country_code);
        try{
            $curl = curl_init();
              curl_setopt_array($curl, [
              CURLOPT_URL => $apiurl,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => "",
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => "PUT",
                CURLOPT_POSTFIELDS => "address_1=".$add1."&address_2=".$add2."&city=".$city."&state=".$state."&country=".$country."&country_code=".$country_code."&zipcode=".$zipcode."",

            CURLOPT_HTTPHEADER => [
                        "Authorization: Basic ".$this->mm_secret_key.'"',
                        "Content-Type: application/x-www-form-urlencoded",
                        "X-Auth-User-ID: ".$mmuser_id],
            ]);

            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $response = json_decode(curl_exec($curl),true);
            $err = curl_error($curl);
            //\Log::info($response);
            curl_close($curl);
            return $response; 
        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }
            }else{
                return response()->json([
                    'status' => 0,
                    'status_code' => 200,
                    'message' => 'match move id is missing'
                    ]); 

            }
        }else{
            return response()->json([
                    'status' => 0,
                    'status_code' => 200,
                    'message' => 'Parameter missing'
                    ]); 
        }

    }

    public function getWalletTrans()
    {
        if($this->req->id!=''){
        $user = User::find($this->req->id);
       // \Log::info($this->product_key);
            if(isset($user->mm_user_id) && $user->mm_user_id!=''){
                $mmuser_id = $user->mm_user_id;
                if($this->req->page)
                {
                    $page = $this->req->page;
                }else{
                    $page = 1;
                }
                $apiurl =$this->baseurl.$this->product_key.'/v1/users/wallets/transactions/'.$page;
                    
                try{
                    $curl = curl_init();
                      curl_setopt_array($curl, [
                      CURLOPT_URL => $apiurl,
                      CURLOPT_RETURNTRANSFER => true,
                      CURLOPT_ENCODING => "",
                      CURLOPT_MAXREDIRS => 10,
                      CURLOPT_TIMEOUT => 30,
                      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                      CURLOPT_CUSTOMREQUEST => "GET",
                      CURLOPT_HTTPHEADER => [
                                "Authorization: Basic ".$this->mm_secret_key.'"',
                                "Content-Type: application/x-www-form-urlencoded",
                                "X-Auth-User-ID:".$mmuser_id],
                    ]);
                        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
                        $response = json_decode(curl_exec($curl),true);
                        $err = curl_error($curl);
                        curl_close($curl);
                        return $response;
                    } catch (\Exception $e) {
                        return response()->json("Server down. Please try again later", 500);
                    }
            }else{
                return response()->json([
                    'status' => 0,
                    'status_code' => 200,
                    'message' => 'match move id is missing'
                    ]); 
            }            
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);
        }

    }

    public function getCardTrans()
    {
        if($this->req->id!='' && $this->req->card_id){
        $user = User::find($this->req->id);

            if(isset($user->mm_user_id) && $user->mm_user_id!=''){
            $mmuser_id = $user->mm_user_id;
            $page = 10;
            $apiurl =$this->baseurl.$this->product_key.'/v1/users/wallets/cards/'.$this->req->card_id.'/transactions/'.$page;
        try{
            $curl = curl_init();
              curl_setopt_array($curl, [
              CURLOPT_URL => $apiurl,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => "",
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => "GET",
              CURLOPT_HTTPHEADER => [
                        "Authorization: Basic ".$this->mm_secret_key.'"',
                        "Content-Type: application/x-www-form-urlencoded",
                        "X-Auth-User-ID: ".$mmuser_id],
            ]);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $response = json_decode(curl_exec($curl),true);
            $err = curl_error($curl);
            curl_close($curl);
            return $response;
        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }
            
            }else{
                return response()->json([
                    'status' => 0,
                    'status_code' => 200,
                    'message' => 'match move id is missing'
                    ]); 

            }
            
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);
        }        
    }

    //Get debits/credits of cards
    public function getWalletCardFund()
    {
        if($this->req->id!='' && $this->req->card_id){
        $user = User::find($this->req->id);
            //\Log::info($this->req->card_id);
            if(isset($user->mm_user_id) && $user->mm_user_id!=''){
            $mmuser_id = $user->mm_user_id;
            $apiurl = $this->baseurl.$this->product_key.'/v1/users/wallets/cards/'.$this->req->card_id.'/funds';
        try{
            $curl = curl_init();
              curl_setopt_array($curl, [
              CURLOPT_URL => $apiurl,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => "",
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => "GET",
              CURLOPT_HTTPHEADER => ["Authorization: Basic ".$this->mm_secret_key.'"',"Content-Type: application/json","X-Auth-User-ID: ".$mmuser_id],
            ]);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $response = json_decode(curl_exec($curl),true);
            $err = curl_error($curl);
           //\Log::info($response);
            curl_close($curl);
            return $response;
        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }
            
            }else{
                return response()->json([
                    'status' => 0,
                    'status_code' => 200,
                    'message' => 'match move id is missing'
                    ]); 

            }
            
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);
        }        
    }

//Create load transaction
    public function createLoadTrans()
    {
        if($this->req->id!='' && $this->req->card_id){
        $user = User::find($this->req->id);
            //\Log::info($this->req->card_id);
            if(isset($user->mm_user_id) && $user->mm_user_id!=''){
            $mmuser_id = $user->mm_user_id;
            $apiurl = $this->baseurl.$this->product_key.'/v1/users/wallets/cards/'.$this->req->card_id.'/funds';
            $this->req->amount = 100;
            $this->req->message = 'Test Amount';
            $this->req->fund_cat_name = 'saving fund';
            /*\Log::info($mmuser_id);
            \Log::info($this->mm_secret_key);*/
        try{
            $curl = curl_init();
              curl_setopt_array($curl, [
              CURLOPT_URL => $apiurl,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => "",
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => "POST",
              CURLOPT_POSTFIELDS => "amount=".$this->req->amount,
              //CURLOPT_POSTFIELDS => "amount=".$this->req->amount."&message=".$this->req->message."&fund_category_name=".$this->req->fund_cat_name,
              CURLOPT_HTTPHEADER => [
                        "Authorization: Basic ".$this->mm_secret_key.'"',
                        "Content-Type: application/json",
                        "X-Auth-User-ID: ".$mmuser_id],
            ]);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $response = json_decode(curl_exec($curl),true);
            $err = curl_error($curl);
            curl_close($curl);
            return $response;
            } catch (\Exception $e) {
                return response()->json("Server down. Please try again later", 500);
            }
            }else{
                return response()->json([
                    'status' => 0,
                    'status_code' => 200,
                    'message' => 'match move id is missing'
                    ]); 
            }
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing id/card_id'
                ]);
        }    
    }

    public function cardSecurityCode()
    {
        if($this->req->id!='' && $this->req->card_id){
        $user = User::find($this->req->id);
            //\Log::info($this->req->card_id);
            if(isset($user->mm_user_id) && $user->mm_user_id!=''){
            $mmuser_id = $user->mm_user_id;
            $apiurl = $this->baseurl.$this->product_key.'/v1/users/wallets/cards/'.$this->req->card_id.'/securities/tokens';
        try{    
            $curl = curl_init();
              curl_setopt_array($curl, [
              CURLOPT_URL => $apiurl,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => "",
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => "GET",
              CURLOPT_HTTPHEADER => [
                        "Authorization: Basic ".$this->mm_secret_key.'"',
                        "Content-Type: application/json",
                        "X-Auth-User-ID: ".$mmuser_id],
            ]);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $response = json_decode(curl_exec($curl),true);
            $err = curl_error($curl);
           //\Log::info($response);
            curl_close($curl);
            return $response;
            
        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }
            }else{
                return response()->json([
                    'status' => 0,
                    'status_code' => 200,
                    'message' => 'match move id is missing'
                    ]); 

            }
            
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);
        }  
    }

    public function getWebhookCategories()
    {
        $apiurl = $this->baseurl.$this->product_key.'/v1/oauth/consumer/'.$this->customer_id.'/event/categories';
    try{
        $curl = curl_init();
        curl_setopt_array($curl, [
        CURLOPT_URL => $apiurl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_SSL_VERIFYHOST, 2,
        CURLOPT_HTTPHEADER => [
            "Authorization: Basic ".$this->mm_secret_key.'"',
            "Content-Type: application/json"
        ],
        ]);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
        echo "cURL Error #:" . $err;
        } else {
        echo $response;
        }

    } catch (\Exception $e) {
        return response()->json("Server down. Please try again later", 500);
    }
}


public function getWebhooks(Request $request)
{
    if($this->req->type!=''){
        
        if($this->req->url)
        {
            $url = $this->req->url;
        }else{
            $url = 'https://devidentitywallet.nityo.in/api/v1/trackWebHookResponse';
        }
        //kyc initiate verification event // must be dynamic
        if($this->req->eventid && $this->req->eventid!='')
        {
            $event = $this->req->eventid;
        }else{
            $event = 'd933faeec8e6fd0c754f8ac5f80a8c38';
        }

        if($this->req->cathash && $this->req->cathash!='')
        {
            $catHash = $this->req->cathash;
        }else{
            $catHash = '';
        }

    if($this->req->type=='getaccount')
        {
            $type = "GET";
            $data = '';
        }

        if($this->req->type=='create')
        {
            $type = "POST";
             $data = "url=".$url."&event_hash=".$event."&category_hash=".$catHash."";
        } 
		if($this->req->type=='put')
        {
            $type = "PUT";
             $data = "url=".$url."&event_hash=".$event."&category_hash=".$catHash."";
        }
        /*if($this->req->type!='create' || $this->req->type!='getaccount')
        {
            return response()->json(['status' => 0,'status_code' => 403,'message' => 'type variable only create/getaccount']);
        }*/


    $apiurl = $this->baseurl.$this->product_key.'/v1/oauth/consumer/'.$this->customer_id.'/webhooks';
    try{
           
			$options = array (
			CURLOPT_POST => true,
			CURLOPT_HEADER => true,
			CURLOPT_URL => $apiurl,
			CURLOPT_FRESH_CONNECT => true,
			CURLOPT_RETURNTRANSFER => true,
			 CURLOPT_CUSTOMREQUEST => $type,
			CURLOPT_FORBID_REUSE => true,
			CURLOPT_TIMEOUT => 10,
			CURLOPT_FAILONERROR => true,
			CURLOPT_POSTFIELDS => $data,           
			CURLOPT_HTTPHEADER => [
                "Authorization: Basic ".$this->mm_secret_key.'"',
                "Content-Type: application/x-www-form-urlencoded"
            ],
			CURLOPT_SSL_VERIFYPEER => false //REMOVE IN PRODUCTION, IGNORES SELFSIGNED SSL            
		);            
		$ch = curl_init();
		curl_setopt_array($ch, $options);
		 $response = curl_exec($ch);
           $err = curl_error($ch);

            if ($err) {
                return "cURL Error #:" . $err;
            } else {
                return $response;
            }
    } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
    }

    }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);
        }  
}

public function getEnumerationsData(Request $request)
{
    $url = $this->baseurl.$this->product_key.'/v1/users/enumerations/';
    //\Log::info($request->all());

    if($this->req->type!=''){
    if($this->req->type=='purpose'){
        $endpoint = 'overseas/transfers/purpose/transferto';
    }
    else if($this->req->type=='country'){
       $endpoint = 'overseas/transfers/countries';
    }
    else if($this->req->type=='relationship'){
        $endpoint = 'overseas/transfers/relationship/transferto';
    }
   else  if($this->req->type=='sources'){
        $endpoint = 'overseas/transfers/sources';
    }
    else if($this->req->type=='document_types'){
        $endpoint = 'document_types';
    }
   else  if($this->req->type=='genders'){
        $endpoint = 'genders';
    }
    else if($this->req->type=='id_types'){
        $endpoint = 'id_types';
    }
    else if($this->req->type=='kyc_types'){
        $endpoint = 'kyc_types';
    }

    else if($this->req->type=='marital_status'){
        $endpoint = 'marital_status';
    }
    else if($this->req->type=='mobile_country_codes'){
        $endpoint = 'mobile_country_codes';
    }
    else if($this->req->type=='nationalities'){
        $endpoint = 'nationalities';
    }
    else if($this->req->type=='titles'){
        $endpoint = 'titles';
    }
	else{
		 return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);
	}
     $apiurl = $url.$endpoint;
    try{
        $curl = curl_init();
          curl_setopt_array($curl, [
          CURLOPT_URL => $apiurl,
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => "",
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 30,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => "GET",
          CURLOPT_HTTPHEADER => [
                    "Authorization: Basic ".$this->mm_secret_key.'"',
                    "Content-Type: application/json"],
        ]);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
        $response = json_decode(curl_exec($curl),true);
    
        $err = curl_error($curl);
        curl_close($curl);
		
        return $response;
		
       
        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }



    }else{
         return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);
    }
}

public function virtualAccount()
{
    if($this->req->id!='' && $this->req->type!=''){
        if($this->req->type=='getaccount')
        {
            $type = "GET";
        }
        if($this->req->type=='create')
        {
            $type = "POST";
        }

        /*if($this->req->type!='create' || $this->req->type!='getaccount')
        {
            return response()->json(['status' => 0,'status_code' => 403,'message' => 'type variable only create/getaccount']);
        }*/
        
        $user = User::find($this->req->id);
            if(isset($user->mm_user_id) && $user->mm_user_id!=''){
            $mmuser_id = $user->mm_user_id;
            $apiurl = $this->baseurl.$this->product_key.'/v1/users/wallets/virtual_accounts';
        try{    
            //\Log::info($mmuser_id);
            $curl = curl_init();
              curl_setopt_array($curl, [
              CURLOPT_URL => $apiurl,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => "",
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => $type,
              CURLOPT_POSTFIELDS => "",
              CURLOPT_HTTPHEADER => [
                        "Authorization: Basic ".$this->mm_secret_key.'"',
                        "Content-Type: application/json",
                        "X-Auth-User-ID: ".$mmuser_id],
            ]);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $response = json_decode(curl_exec($curl),true);
            $err = curl_error($curl);
            //\Log::info($response);
            curl_close($curl);
            return $response;
        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }
            }else{
                return response()->json([
                    'status' => 0,
                    'status_code' => 200,
                    'message' => 'match move id is missing'
                    ]); 
            }
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);
        }  
}

// get account transaction
public function getbankAccount()
{
	
    if($this->req->id!=''){
		
        if(isset($this->req->type) && $this->req->type=='getaccount')
        {
			
            $type = "GET";
        }else{
             return response()->json(['status' => 0,'status_code' => 403,'message' => 'type parameter is missing']);
        }
      /*   if(isset($this->req->type) && $this->req->type=='create')
        {
            $type = "POST";
        }else{
            return response()->json(['status' => 0,'status_code' => 403,'message' => 'type parameter is missing']);
        } */

       /* if($this->req->type!='create' || $this->req->type!='getaccount')
        {
            return response()->json(['status' => 0,'status_code' => 403,'message' => 'type variable only create/getaccount']);
        }*/

         $cardarray=0;
        $user = User::find($this->req->id);
            if(isset($user->mm_user_id) && $user->mm_user_id!=''){
            $mmuser_id = $user->mm_user_id;
            $apiurl = $this->baseurl.$this->product_key.'/v1/users/wallets/bank_accounts';
        try{  
            $curl = curl_init();
              curl_setopt_array($curl, [
              CURLOPT_URL => $apiurl,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => "",
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => $type,
              CURLOPT_POSTFIELDS => "",
              CURLOPT_HTTPHEADER => [
                        "Authorization: Basic ".$this->mm_secret_key.'"',
                        "Content-Type: application/json",
                        "X-Auth-User-ID:".$mmuser_id],
            ]);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $response = json_decode(curl_exec($curl),true);
            $err = curl_error($curl);
            //\Log::info($response);
            curl_close($curl);
			//$cardarray=$response['data'];
		
            return $response;
        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }
			//print_r($cardarray[0]['bank_account_number']);
            }else{
                return response()->json([
                    'status' => 0,
                    'status_code' => 200,
                    'message' => 'match move id is missing'
                    ]); 
            }
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);
        }  
}

public function beneficiaryAccount()
{
    if($this->req->id!=''){
        if(isset($this->req->type) && $this->req->type=='getaccount')
        {
            $type = "GET";
             $data = '';
        }
        else if(isset($this->req->type) && $this->req->type=='create')
        {
            $type = "POST";
            $acc = $this->req->bank_acc;
            //$data = "bank_account_number=".$acc."&bank_holder_name=".$this->req->acc_holder_name."&bank_code=".$this->req->bank_code."";
            $data = "bank_account_number=5543213121&bank_holder_name=Test%20Creditor%20name&bank_code=ANZBSGS0XXX";

        }
        else if(isset($this->req->type) && $this->req->type=='delete')
        {
            $type = "DELETE";
            $acc = $this->req->bank_id;
            $data = "id=".$acc."";
            //$data='';
        }else{
            return response()->json(['status' => 0,'status_code' => 403,'message' => 'type parameter is missing']);

        }

        /*if($this->req->type!='create' || $this->req->type!='getaccount' || $this->req->type!='delete'){
            return response()->json(['status' => 0,'status_code' => 403,'message' => 'type variable only create/getaccount/delete']);
        }*/


            $user = User::find($this->req->id);
            if(isset($user->mm_user_id) && $user->mm_user_id!=''){
            $mmuser_id = $user->mm_user_id;
			
            //\Log::info($mmuser_id);
            $apiurl = $this->baseurl.$this->product_key.'/v1/users/wallets/bank_accounts';
          /*  "account_number": "6377021420622100",
                    "bank_holder_name": "Mohd Nityo Anas",
                    "bank_account_limit": null,
                    "bank_bic": "MAYPSGS0XXX",
                    "status": "active",*/
           /*\Log::info($mmuser_id);
           \Log::info($apiurl);
           \Log::info($data);
           \Log::info($this->mm_secret_key);*/
        try{
            $curl = curl_init();
              curl_setopt_array($curl, [
              CURLOPT_URL => $apiurl,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => "",
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => $type,
              //CURLOPT_POSTFIELDS =>  "bank_account_number=5543213121&bank_holder_name=Test%20Creditor%20name&bank_code=ANZBSGS0XXX",
              CURLOPT_POSTFIELDS => $data,
              CURLOPT_HTTPHEADER => [
                        "Authorization: Basic ".$this->mm_secret_key.'"',
                        "Content-Type: application/x-www-form-urlencoded",
                        "X-Auth-User-ID:".$mmuser_id],
            ]);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $response = json_decode(curl_exec($curl),true);
            $err = curl_error($curl);
            //\Log::info($response);
            curl_close($curl);
            return $response;
        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }
            }else{
                return response()->json([
                    'status' => 0,
                    'status_code' => 200,
                    'message' => 'match move id is missing'
                    ]); 
            }
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);
        }  
}


public function creditBankAccount()
{
    if($this->req->id!=''){
        $user = User::find($this->req->id);
            if(isset($user->mm_user_id) && $user->mm_user_id!=''){
            $mmuser_id = $user->mm_user_id;
           $apiurl = $this->baseurl.$this->product_key.'/v1/simulate/transfer_in';
          
    
    //Username: 5d41402abc4b2a76b9719d911017c592        
    //Password: cf23df2207d99a74fbe169e3eba035e633b65d94
    try{
    $curl = curl_init();
        curl_setopt_array($curl, [
          CURLOPT_URL => $apiurl,
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => "",
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 30,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => "POST",
          CURLOPT_POSTFIELDS => '{
                 "amount": "50.00",
                    "client_ref_id": "MOCK-idwgpr",
                    "currency": "SGD",
                    "purpose_of_transfer": "INV",
                    "source_account": {
                        "number": "6377021420552349",
                        "name": "Saurav Test Mid Name Test Lname",
                        "bank_code": "MAYPSGS0XXX"
                    },
                    "beneficiary_account": {
                        "number": "6377021421066786",
                        "name": "Tiwarat Wattna",
                        "bank_code": "MAYPSGS0XXX"
                    },
                    "simulate_cancellation": false
                }',
          CURLOPT_HTTPHEADER => [
            "Authorization: Basic NWQ0MTQwMmFiYzRiMmE3NmI5NzE5ZDkxMTAxN2M1OTI6Y2YyM2RmMjIwN2Q5OWE3NGZiZTE2OWUzZWJhMDM1ZTYzM2I2NWQ5NA==",
            "Content-Type: application/json"],
        ]);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $response = json_decode(curl_exec($curl),true);
            $err = curl_error($curl);
            // \Log::info('response here!!');
            //\Log::info($response);
            curl_close($curl);
            ///\Log::info('error here!!');
            //\Log::info($err);
            return $response;
        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }
            }else{
                return response()->json([
                    'status' => 0,
                    'status_code' => 200,
                    'message' => 'match move id is missing'
                    ]); 
            }
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);
        }  
}

// transfer-in Api

public function transferIn()
{
    if($this->req->id!=''){
        $user = User::find($this->req->id);
            if(isset($user->mm_user_id) && $user->mm_user_id!=''){
            $mmuser_id = $user->mm_user_id;
           $apiurl = $this->baseurl.$this->product_key.'/v1/simulate/transfer_in';
          
        if($this->req->amount)
        {
            $amount = $this->req->amount;
        }else{
            return response()->json(['status' => 0,'status_code' => 403,'message' => 'Amount parameter is missing']);
        }
        if($this->req->sr_acc_number && $this->req->sr_name && $this->req->sr_bank_code)
        {
            $source_account = array('number'=>$this->req->sr_acc_number,'name'=>$this->req->sr_name,'bank_code'=>$this->req->sr_bank_code);
        }else{
            return response()->json(['status' => 0,'status_code' => 403,'message' => 'source account parameter is missing']);
        }

        if($this->req->bnf_acc_number && $this->req->bnf_name && $this->req->bnf_bank_code)
        {
            $bnf_account = array('number'=>$this->req->bnf_acc_number,'name'=>$this->req->bnf_name,'bank_code'=>$this->req->bnf_bank_code);
        }else{
            return response()->json(['status' => 0,'status_code' => 403,'message' => 'Beneficiary account parameter is missing']);
        }

    //Username: 5d41402abc4b2a76b9719d911017c592        
    //Password: cf23df2207d99a74fbe169e3eba035e633b65d94

    /*
    :{
    "amount": "1.00",
    "client_ref_id": "MOCK-idwgpr",
    "currency": "SGD",
    "purpose_of_transfer": "INV",
    "source_account": {
        "number": "6377021420552349",
        "name": "Saurav Test Mid Name Test Lname",
        "bank_code": "MAYPSGS0XXX"
    },
    "beneficiary_account": {
        "number": "6377021421066786",
        "name": "Tiwarat Wattna",
        "bank_code": "MAYPSGS0XXX"
    },
    "simulate_cancellation": false
}

    */

   
    $sr_m = '{
                        "number": "'.$this->req->sr_acc_number.'",
                        "name": "'.$this->req->sr_name.'",
                        "bank_code": "'.$this->req->sr_bank_code.'"
                    }';

    $bnf = '{
                        "number": "'.$this->req->bnf_acc_number.'",
                        "name": "'.$this->req->bnf_name.'",
                        "bank_code": "'.$this->req->bnf_bank_code.'"
                    }';

    $payload = '{
        "amount": "'.$amount.'",
        "client_ref_id": "MOCK-idwgpr",
        "currency": "SGD",
        "purpose_of_transfer": "INV",
        "source_account": '.$sr_m.',
        "beneficiary_account": '.$bnf.',
        "simulate_cancellation": false
    }';

   
    //\Log::info($mmuser_id);
    //\Log::info($payload);
    try{
        $curl = curl_init();
        curl_setopt_array($curl, [
          CURLOPT_URL => $apiurl,
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => "",
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 30,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => "POST",
          CURLOPT_POSTFIELDS => $payload,
          CURLOPT_HTTPHEADER => [
            "Authorization: Basic NWQ0MTQwMmFiYzRiMmE3NmI5NzE5ZDkxMTAxN2M1OTI6Y2YyM2RmMjIwN2Q5OWE3NGZiZTE2OWUzZWJhMDM1ZTYzM2I2NWQ5NA==",
            "Content-Type: application/json","X-Auth-User-ID: ".$mmuser_id],
        ]);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $response = json_decode(curl_exec($curl),true);
            $err = curl_error($curl);
            //\Log::info('response here!!');
            //\Log::info($response);
            curl_close($curl);
            //\Log::info('error here!!');//\Log::info($err);
            return $response;
        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }
            }else{
                return response()->json([
                    'status' => 0,
                    'status_code' => 200,
                    'message' => 'match move id is missing'
                    ]); 
            }
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);
        }  
}



public function transferOut()
{
    if($this->req->id!=''){
        $user = User::find($this->req->id);
            if(isset($user->mm_user_id) && $user->mm_user_id!=''){
            $mmuser_id = $user->mm_user_id;
            $apiurl = $this->baseurl.$this->product_key.'/v1/users/wallets/fund_transfers/credit';
            /*\Log::info($this->mm_secret_key);*/
            //\Log::info($mmuser_id);
            //\Log::info($apiurl);
            if($this->req->amount)
            {
                $amount = $this->req->amount;
            }else{
                return response()->json(['status' => 0,'status_code' => 403,'message' => 'amount parameter is missing']);
            }
            if($this->req->bank_account_id){
                $bank_account_id = $this->req->bank_account_id;
            }else{
                //for testing                 //$bank_account_id = '57af7083-1e65-416e-92ab-dba73bf4a73c';
                return response()->json(['status' => 0,'status_code' => 403,'message' => 'bank_account_id parameter is missing']);
            }
            if($this->req->client_ref_id)
            {
                $client_ref_id = $this->req->client_ref_id;
            }else{
                return response()->json(['status' => 0,'status_code' => 403,'message' => 'client_ref_id parameter is missing']);
            }
            $payload = "amount=".$amount."&bank_account_id=".$bank_account_id."&currency=SGD&purpose_of_transfer=INV&client_ref_id=".$client_ref_id;
        try{
            $curl = curl_init();
                curl_setopt_array($curl, [
                  CURLOPT_URL => $apiurl,
                  CURLOPT_RETURNTRANSFER => true,
                  CURLOPT_ENCODING => "",
                  CURLOPT_MAXREDIRS => 10,
                  CURLOPT_TIMEOUT => 30,
                  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                  CURLOPT_CUSTOMREQUEST => "POST",
                  CURLOPT_POSTFIELDS => $payload,
                  CURLOPT_HTTPHEADER => [
                    "Authorization: Basic ".$this->mm_secret_key.'"',
                    "Content-Type: application/x-www-form-urlencoded",
                    "X-Auth-User-ID: ".$mmuser_id],
                ]);
                curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
                    $response = json_decode(curl_exec($curl),true);
                    $err = curl_error($curl);
                //\Log::info($response);
                    curl_close($curl);
                    return $response;
        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }

          }else{
                return response()->json([
                    'status' => 0,
                    'status_code' => 200,
                    'message' => 'match move id is missing'
                    ]); 
            }
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);
        }  
}


public function creditTransfer()
{
    if($this->req->id!=''){
        $user = User::find($this->req->id);
            if(isset($user->mm_user_id) && $user->mm_user_id!=''){
            $mmuser_id = $user->mm_user_id;
            $apiurl = $this->baseurl.$this->product_key.'/v1/users/wallets/funds';
            $amount = 1;
            
              $data = "rule=&email=vinay.jaiswal399@nityo.com&mobile_country_code=65&mobile=1899782009&user_id=b56d4d523a6fcc0a6e27dd00b6abd34b&amount=5&details=&forwarded_for=&hashed_pan=&type=&load_card=&card_id=&fund_category_name=&allow_split_category_transaction=";


            //\Log::info($data);
            try{
            $curl = curl_init();
                curl_setopt_array($curl, [
                  CURLOPT_URL => $apiurl,
                  CURLOPT_RETURNTRANSFER => true,
                  CURLOPT_ENCODING => "",
                  CURLOPT_MAXREDIRS => 10,
                  CURLOPT_TIMEOUT => 30,
                  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                  CURLOPT_CUSTOMREQUEST => "POST",
                  CURLOPT_POSTFIELDS => $data,
                  CURLOPT_HTTPHEADER => [
                   // "Authorization: Basic ".$this->mm_secret_key.'"',
                    "Content-Type: application/x-www-form-urlencoded",
                    "X-Auth-User-ID: ".$mmuser_id],
                ]);
                curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
                    $response = json_decode(curl_exec($curl),true);
                    $err = curl_error($curl);
                    //\Log::info($response);
                    curl_close($curl);
                    return $response;
            } catch (\Exception $e) {
                return response()->json("Server down. Please try again later", 500);
            }

          }else{
                return response()->json([
                    'status' => 0,
                    'status_code' => 200,
                    'message' => 'match move id is missing'
                    ]); 
            }
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);
        }  
}

public function deleteBankAccount()
{
    if($this->req->id!=''){
        $user = User::find($this->req->id);
        if(isset($user->mm_user_id) && $user->mm_user_id!=''){
        $mmuser_id = $user->mm_user_id;
        $apiurl = $this->baseurl.$this->product_key.'/v1/users/wallets/bank_accounts';
        try{
            $curl = curl_init();
            $bankId = $this->req->bankId;
            curl_setopt_array($curl, [
              CURLOPT_URL => $apiurl,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => "",
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => "DELETE",
              CURLOPT_POSTFIELDS => "id=".$bankId,
              CURLOPT_HTTPHEADER => [
                "Authorization: Basic ".$this->mm_secret_key.'"',
                "Content-Type: application/json",
                "X-Auth-User-ID: ".$mmuser_id],
            ]);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
                $response = json_decode(curl_exec($curl),true);
                $err = curl_error($curl);
                //\Log::info($response);
                curl_close($curl);
                return $response;

        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }
            }else{
                return response()->json([
                    'status' => 0,
                    'status_code' => 200,
                    'message' => 'match move id is missing'
                    ]); 
            }
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);
        }

}


public function webhooksInfo()
{
    if($this->req->type!='' && $this->req->webhook_id!=''){
    if($this->req->type=='getinfo')
        {
            $type = "GET";
        }
        if($this->req->type=='delete')
        {
            $type = "DELETE";
        }
        if($this->req->type=='update')
        {
            $type = "DELETE";
        }

    $apiurl = $this->baseurl.$this->product_key.'/v1/oauth/consumer/'.$this->customer_id.'/webhooks/'.$this->req->webhook_id;
    //\Log::info($apiurl);
    try{
       /*  $curl = curl_init();
        curl_setopt_array($curl, [
        CURLOPT_URL => $apiurl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => $type,
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_SSL_VERIFYHOST, 2,
        CURLOPT_HTTPHEADER => [
            "Authorization: Basic ".$this->mm_secret_key.'"',
            "Content-Type: application/json"
        ],
        ]);

        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl); */
		
		$options = array (
			CURLOPT_POST => true,
			CURLOPT_HEADER => true,
			CURLOPT_URL => $apiurl,
			CURLOPT_FRESH_CONNECT => true,
			CURLOPT_RETURNTRANSFER => true,
			 CURLOPT_CUSTOMREQUEST => $type,
			CURLOPT_FORBID_REUSE => true,
			CURLOPT_TIMEOUT => 10,
			CURLOPT_FAILONERROR => true,          
			CURLOPT_HTTPHEADER => [
                "Authorization: Basic ".$this->mm_secret_key.'"',
                "Content-Type: application/x-www-form-urlencoded"
            ],
			CURLOPT_SSL_VERIFYPEER => false //REMOVE IN PRODUCTION, IGNORES SELFSIGNED SSL            
		);            
		$ch = curl_init();
		curl_setopt_array($ch, $options);
		 $response = curl_exec($ch);
           $err = curl_error($ch);
            return $response;
    } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }

    }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);
        } 

}

public function activateUser()
{
    if($this->req->id!=''){
        $user = User::find($this->req->id);
        if(isset($user->mm_user_id) && $user->mm_user_id!=''){
        $mmuser_id = $user->mm_user_id;
        $apiurl =$this->mmbase_url.'users/'.$mmuser_id;
        //\Log::info($apiurl);//\Log::info($this->mm_secret_key);
        //\Log::info($mmuser_id);
        try{
            $curl = curl_init();
            curl_setopt_array($curl, [
              CURLOPT_URL => $apiurl,
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => "",
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 30,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => "POST",
              CURLOPT_POSTFIELDS => "id=".$mmuser_id,
              CURLOPT_HTTPHEADER => [
                "Authorization: Basic ".$this->mm_secret_key.'"',
                "Content-Type: application/x-www-form-urlencoded"
                //"X-Auth-User-ID: ".$mmuser_id
              ],
            ]);
            curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $response = json_decode(curl_exec($curl),true);
           // \Log::info($response);
            $err = curl_error($curl);
            curl_close($curl);
			 $result=DB::table('users')
                ->where('id',$this->req->id)
                ->update([
                    'status'=> 1,
                ]);
            if ($err) {
                return "cURL Error #:" . $err;
            } else {
                return $response;
            }

            $result = '';
            if(isset($response['id']))
            {
              
            }else{
                return $response;
            }

        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }

         }else{
                return response()->json([
                    'status' => 0,
                    'status_code' => 200,
                    'message' => 'match move id is missing'
                    ]); 
            }

}else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);
        } 
                        
}


public function detailWebhooks(Request $request)
{
    if($this->req->type!=''){
        if($this->req->webhookid!='')
        {
            $webhokId = $this->req->webhookid;
        }else{
            $webhokId = 'c1588062ac9d4748a2416f8e13c87644';
        }
        if($this->req->url!=''){
            $url = $this->req->url;
        }else{
            $url = 'https://devidentitywallet.nityo.in/api/v1/trackWebHookResponse';
        }
        
    if($this->req->type=='getwebhook')
        {
            $type = "GET";
            $data = '';
        }

        if($this->req->type=='updatewebhook')
        {
            $type = "PUT";
             $data = "url=".$url;
        }
        if($this->req->type=='delete')
        {
            $type = "DELETE";
             $data = '';
        }

    $apiurl = $this->baseurl.$this->product_key.'/v1/oauth/consumer/'.$this->customer_id.'/webhooks/'.$webhokId;
	//echo $apiurl;die;
    //\Log::info($apiurl);
    try{
           /*  $curl = curl_init();
            curl_setopt_array($curl, [
            CURLOPT_URL => $apiurl,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => $type,
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_SSL_VERIFYHOST, 2,
            CURLOPT_POSTFIELDS => '',
            CURLOPT_HTTPHEADER => [
                "Authorization: Basic ".$this->mm_secret_key.'"',
                "Content-Type: application/x-www-form-urlencoded"
            ],
            ]);
            $response = curl_exec($curl);
            $err = curl_error($curl); */
          //  curl_close($curl);
			$options = array (
			CURLOPT_POST => true,
			CURLOPT_HEADER => true,
			CURLOPT_URL => $apiurl,
			CURLOPT_FRESH_CONNECT => true,
			CURLOPT_RETURNTRANSFER => true,
			 CURLOPT_CUSTOMREQUEST => $type,
			CURLOPT_FORBID_REUSE => true,
			CURLOPT_TIMEOUT => 10,
			CURLOPT_FAILONERROR => true,
			CURLOPT_POSTFIELDS => $data,           
			CURLOPT_HTTPHEADER => [
                "Authorization: Basic ".$this->mm_secret_key.'"',
                "Content-Type: application/x-www-form-urlencoded"
            ],
			CURLOPT_SSL_VERIFYPEER => false //REMOVE IN PRODUCTION, IGNORES SELFSIGNED SSL            
		);            
		$ch = curl_init();
		curl_setopt_array($ch, $options);
		 $response = curl_exec($ch);
           $err = curl_error($ch);
            if ($err) {
                return "cURL Error #:" . $err;
            } else {
                return $response;
            }
        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }

    }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);
        }  
}


public function deletePreference()
{
    if($this->req->id!='' && $this->req->cat_id!='')
    {
        try {
            DB::table('user_preference')->where('user_id', '=', $this->req->id)->where('category_id', '=', $this->req->cat_id)->delete();
            return response()->json([
                    'status' => 1,
                    'status_code' => 200,
                    'message' => 'Preference deleted'
                    ]);
        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }
    }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);
        } 
}
		public function updateLocationstatus(Request $request)
		{
			 //return response()->json(auth()->user());
            $id=$request->user_id;
            $result=DB::table('users')
                ->where('id', $id)
                ->update([
                    'location_access_constent'=> '1'
                    
                ]);

            if(($result))
            {
                return response()->json([
                    'status'=>1,
                    'status_code'=>200,
                    'message'=>'Location Status updated',
                ]);
            }else{
                return response()->json([
                    'status'=>0,
                    'status_code'=>203,
                    'message'=>'Parameter missing',
                ]);
            }
		}
        public function insertGeoLoction(Request $request)
        {
           
            $user_id = $request->user_id; 
            $latitude = $request->latitude;       
            $longitude = $request->longitude;
			 
					
            $date = date('Y-m-d H:i:s');
            $locationdata = DB::table('users')->select('*')->where('id',$user_id)->first();
            $datas = $locationdata->location_access_constent;
            $token = $locationdata->fcmtoken;
            if($datas == 1){
                   $locationlist=DB::table('offer_locations')->select('*')
					 ->leftjoin('frequency_location','frequency_location.id','=','offer_locations.location_id')
					 ->leftjoin('offer_users','offer_users.offer_id','=','offer_locations.offer_id')
                    ->where('offer_users.data_share','=',1)
                    ->where('offer_users.open_to_contact','=',1)
					 ->get()
					->groupBy('offer_locations.offer_id');
					
                   foreach($locationlist as $location){
				   /* $url = "https://maps.googleapis.com/maps/api/geocode/json?address=".urlencode($location->zipcode)."&sensor=false&key=googleapi";
    $result_string = file_get_contents($url);
    $result = json_decode($result_string, true);
    if(!empty($result['results'])){
        $zipLat = $result['results'][0]['geometry']['location']['lat'];
        $ziplng = $result['results'][0]['geometry']['location']['lng'];
    } */
	$zipLat='10.755306935372436';
	$ziplng='79.25517677546561';
	if($this->distance($zipLat, $ziplng, $latitude, $longitude, "K") < 2)
		{
			$checkoffer = DB::table('offer_claim')->select('*')->where('offer_id',$location[0]->offer_id)->where('user_id',$user_id)->first();
			if(empty($checkoffer)){
				$insertData = DB::table('offer_claim')->insertGetId([               
                        'user_id' => $user_id,
                        'offer_id' => $location[0]->offer_id,
                        'created_at' => $date
                    ]);
			$msgoffer = DB::table('offer_broadcast_message')->select('*')->where('offer_id',$location[0]->offer_id)->first();
            $title = $msgoffer->title;
            $message1 = $msgoffer->message1;
			 $insertmsg = DB::table('push_messages')->insert(['user_id' => $user_id, 'offer_id' => $location[0]->offer_id, 'messages' => $message1,'title' =>$title,'created_at' => date("Y-m-d h:i:s"),'updated_at' =>date("Y-m-d h:i:s")]);
		  $this->notification($token,$title,$message1,$location[0]->offer_id);
			}
		}
		
				   }	
			
            $insertGeoData = DB::table('user_geo_location')->insertGetId([               
                        'user_id' => $user_id,
                        'latitude' => $latitude,
                        'longitude' => $longitude,
                        'created_at' => $date
                    ]);
            return response()->json([
                                'status' => 1,
                                'status_code' => 200,
                                'message' => 'Geo Location Inserted Successfully',
                                'data' => ''
                            ]);
        }
        else
        {
            return response()->json([
                                'status' => 0,
                                'status_code' => 200,
                                'message' => 'Geo Data Not Inserted',
                                'data' => ''
                            ]);
        }
    }

public function suppertedBank()
{
    $apiurl = $this->baseurl.$this->product_key.'/v1/users/enumerations/transfers/banks';
    //\Log::info($apiurl);
    try {
        $curl = curl_init();
        curl_setopt_array($curl, [
        CURLOPT_URL => $apiurl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_SSL_VERIFYHOST, 2,
        CURLOPT_HTTPHEADER => [
        "Authorization: Basic ".$this->mm_secret_key.'"',
        "Content-Type: application/x-www-form-urlencoded"
        ],
        ]);

        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);

        if ($err) {
        return "cURL Error #:" . $err;
        } else {
        return $response;
        }

    } catch (\Exception $e) {
        return response()->json("Server down. Please try again later", 500);
    }
}

public function trackWebHookResponse()
{
    if(isset($this->req))
    {
        $webhooksRes = new MmEventLog;
        $webhooksRes->mm_api_json = $this->req->all();
        $webhooksRes->save();
    }
}


public function getAccountTrans()
    {
        if($this->req->id!=''){
        $user = User::find($this->req->id);
            if(isset($user->mm_user_id) && $user->mm_user_id!=''){
            $mmuser_id = $user->mm_user_id;

            if($this->req->page)
            {
                $page = $this->req->page;
            }else{
                $page = 1;
            }

            $apiurl =$this->baseurl.$this->product_key.'/v1/users/wallets/account/transactions/'.$page;
            //\Log::info($apiurl);
            try {
                $curl = curl_init();
                  curl_setopt_array($curl, [
                  CURLOPT_URL => $apiurl,
                  CURLOPT_RETURNTRANSFER => true,
                  CURLOPT_ENCODING => "",
                  CURLOPT_MAXREDIRS => 10,
                  CURLOPT_TIMEOUT => 30,
                  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                  CURLOPT_CUSTOMREQUEST => "GET",
                  CURLOPT_HTTPHEADER => [
                            "Authorization: Basic ".$this->mm_secret_key.'"',
                            "Content-Type: application/json",
                            "X-Auth-User-ID: ca8742776f7cb1ffbd7c427c5fb324fd"],
                ]);
                curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
                $response = json_decode(curl_exec($curl),true);
                $err = curl_error($curl);
                //\Log::info($response);
                curl_close($curl);
                return $response;
            } catch (\Exception $e) {
                return response()->json("Server down. Please try again later", 500);
            }
            
            }else{
                return response()->json([
                    'status' => 0,
                    'status_code' => 200,
                    'message' => 'match move id is missing'
                    ]); 

            }
            
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);
        }

    }

    public function getBankTransactions()
    {
		
		 if($this->req->id){
            $user = User::find($this->req->id);
        if(isset($user->mm_user_id) && $user->mm_user_id!=''){
            $mmuser_id = $user->mm_user_id;
		 }
		 }
        if($this->req->page)
        {
            $page = $this->req->page;
        }else{
            $page = 1;
        }
		 if($this->req->transtype=="card"){
			 $apiurl = $this->baseurl.$this->product_key.'/v1/users/wallets/transactions/'.$page;
			  $apiurl =$this->mmbase_url.'users/wallets/cards/'.$this->req->card.'/transactions/'. $page;
		 }else{
			$apiurl = $this->baseurl.$this->product_key.'/v1/users/wallets/transactions/'.$page; 
		 }
		
          
    //\Log::info($mmuser_id);
    try {
        $curl = curl_init();
        curl_setopt_array($curl, [
          CURLOPT_URL => $apiurl,
          CURLOPT_RETURNTRANSFER => true,
          CURLOPT_ENCODING => "",
          CURLOPT_MAXREDIRS => 10,
          CURLOPT_TIMEOUT => 30,
          CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
          CURLOPT_CUSTOMREQUEST => "GET",
           CURLOPT_HTTPHEADER => [
                                "Authorization: Basic ".$this->mm_secret_key.'"',
                                "Content-Type: application/x-www-form-urlencoded",
                                "X-Auth-User-ID:".$mmuser_id],
                    ]);
        //,"X-Auth-User-ID: ".$mmuser_id
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
            $response = json_decode(curl_exec($curl),true);
            $err = curl_error($curl);
                        curl_close($curl);
            return $response;

        } catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }
    }

    public function getQuestionCounts(Request $request)
    {
        try{
            if($this->req->id!=''){
                $user = User::find($this->req->id);
                if($user){
                    $data = array();
                    $questCount = QuestionBank::count();
                    $answerCount = DB::table('user_questionbank_answer')->where('user_id',$this->req->id)->count();
                    $unansweredCount = $questCount - $answerCount;
                    $data['questCount'] = $questCount;
                    $data['answerCount'] = $answerCount;
                    $data['unansweredCount'] = $unansweredCount;
                    return response()->json([
                            'status' => 0,
                            'status_code' => 200,
                            'data' => $data,
                            'message' => 'questions data'
                        ]);
                }else{
                    return response()->json([
                            'status' => 0,
                            'status_code' => 200,
                            'message' => 'User Not found!'
                        ]);
                }

            }else{
                return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);
            }


        }catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }
    }

    public function getCategoryDetailList(Request $request)
    {
        //Category name, category id, keycode  id(question)
        try
        {
            $catData = DB::table('category')->select('category.category_name','category_keycode.category_id','category_keycode.keycode_id')
                ->join('category_keycode', 'category_keycode.category_id', '=', 'category.id')
                ->where('category.status','1')
                ->get();
            return response()->json([
                            'status' => 0,
                            'status_code' => 200,
                            'data' => $catData,
                            'message' => 'category data'
                        ]);
        }catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }
    }

    public function getAllQuestAnswer(Request $request)
    {
        try{
            if($this->req->id!=''){
                $user = User::find($this->req->id);
                if($user){
                    $data = DB::select("SELECT * FROM user_questionbank_answer where user_id = ".$this->req->id." and (answer IS NOT null or answer_filepath IS NOT null)");

                return response()->json([
                            'status' => 1,
                            'status_code' => 200,
                            'data' => $data,
                            'message' => 'questions data'
                        ]);
            }else{
                    return response()->json([
                            'status' => 0,
                            'status_code' => 200,
                            'message' => 'User Not found!'
                        ]);
                }

            }else{
                return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]);
            }


        }catch (\Exception $e) {
            return response()->json("Server down. Please try again later", 500);
        }

    }

public function getAllUsers()
{
    $users = User::get();

    return response()->json([
                'status' => 0,
                'status_code' => 200,
                'data'=>$users,
                'message' => 'Parameter missing'
                ]);
}


public function getAllRecDocs(Request $request)
{

	  if($request->id){
		  
             try{
		
        $folderlist = DB::table('folder')->where('user_id',$request->id)->orWhere('user_id', 0)->get();
                                
		 foreach($folderlist as $folder){
			$folder->docdetails = DB::table('rec_docs')
                                ->where('folder_id',$folder->id)->get();
		} 
		
		 return response()->json([
                            'status' => 1,
                            'status_code' => 200,
                            'data' => $folderlist,
                            'message' => 'folder data'
                        ]);
		
  
    }catch (\Exception $e) {
        return response()->json("Server down. Please try again later", 500);
    }
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'Parameter missing'
                ]); 
        }

			}
			
			
			public function getSingleDocs(Request $request)
			{

				  if($request->folder_id){
					  
						 try{
					
					$categories = DB::table('rec_docs')->where('folder_id',$request->folder_id)->get();
					
					 return response()->json([
										'status' => 1,
										'status_code' => 200,
										'data' => $categories,
										'message' => 'categories data'
									]);
					
			  
				}catch (\Exception $e) {
					return response()->json("Server down. Please try again later", 500);
				}
					}else{
						return response()->json([
							'status' => 0,
							'status_code' => 200,
							'message' => 'Parameter missing'
							]); 
					}

			}	
			
			public function checkCategory(Request $request)
			{

				  if($request->doc_cat_id){
						 try{
					
					$categories = DB::table('user_document_storage')->where('folder_id',$request->folder_id)->where('user_id',$request->user_id)->where('doc_cat_id',$request->doc_cat_id)->count(); 
					if($categories>0){
					 return response()->json([
										'status' => 1,
										'status_code' => 200,
										'data' => $categories,
										'message' => 'categories data'
									]);	
					}else{
					 return response()->json([
										'status' => 2,
										'status_code' => 203,
										'data' => $categories,
										'message' => 'No categories found'
									]);		
						
					}
					
					
			  
				}catch (\Exception $e) {
					return response()->json("Server down. Please try again later", 500);
				}
					}else{
						return response()->json([
							'status' => 0,
							'status_code' => 200,
							'message' => 'Parameter missing'
							]); 
					}

			}

		public function getFolderPercent(Request $request)
		{

					 try{
				 $folderlist = DB::table('folder')->where('user_id',0)->get();
				 foreach($folderlist as $folder){
					$folder->totalcount = DB::table('rec_docs')
										->where('folder_id',$folder->id)->count(); 
                    $folder->insertedcount=DB::table('user_document_storage') -> where('user_id', $request->user_id) -> where('folder_id', $folder->id)-> where('is_deleted', '!=',1)-> where('doc_cat_id', '!=', 0)->count();
					  if($folder->insertedcount!=0){
					 $folder->percentage =($folder->insertedcount/$folder->totalcount)*100;
					  }else{
					 $folder->percentage =0;	  
					  }
				} 
				
				 return response()->json([
									'status' => 1,
									'status_code' => 200,
									'data' => $folderlist,
									'message' => 'folder data'
								]);
				
		  
			}catch (\Exception $e) {
				return response()->json("Server down. Please try again later", 500);
			}
				

		}
          public function insertToken(Request $request)
		{

			  if($request->user_id && $request->fcmToken){
				  
					 try{
				 $result=DB::table('users')
                ->where('id', $request->user_id)
                ->update([
                    'fcmtoken'=> $request->fcmToken,
                ]);
				  if(($result))
            {
                return response()->json([
                    'status'=>1,
                    'status_code'=>200,
                    'message'=>'Token updated successfully',
                ]);
            }else{
                return response()->json([
                    'status'=>0,
                    'status_code'=>203,
                    'message'=>'Token not updated',
                ]);
            }
		  
			}catch (\Exception $e) {
				return response()->json("Server down. Please try again later", 500);
			}
			}else{
						return response()->json([
							'status' => 0,
							'status_code' => 200,
							'message' => 'Parameter missing'
							]); 
					}
				

		}   
		public function getMessages(Request $request)
		{

			  if($request->user_id ){
					 try{
				 $result=DB::table('push_messages')
                ->where('user_id', $request->user_id)->orderBy('id','DESC')->get();
               
				  if(($result))
            {
                return response()->json([
									'status' => 1,
									'status_code' => 200,
									'data' => $result,
									'message' => 'message data'
								]);
            }else{
                return response()->json([
                    'status'=>0,
                    'status_code'=>203,
                    'message'=>'message not found',
                ]);
            }
		  
			}catch (\Exception $e) {
				return response()->json("Server down. Please try again later", 500);
			}
			}else{
						return response()->json([
							'status' => 0,
							'status_code' => 200,
							'message' => 'Parameter missing'
							]); 
					}
				

		}
		public function getcompanycoupan(Request $request)
		{
			
			$currentdate=Date("Y-m-d");
			  if($request->user_id ){
				     $coupan_arr = array();
				     $coupan_obj = array();
				     $coupan_code = array();
					 try{
				 $result1 = DB::select("SELECT master_coupon.code FROM master_coupon where master_coupon.code not in(select code from company_coupons)");
				 foreach($result1 as $res){
					 $coupan_code[]=$res->code;
				 }
				 $result2 = DB::select("SELECT master_coupon.code FROM master_coupon where master_coupon.code in(select code from company_coupons where user_id=".$request->user_id.")");
				  foreach($result2 as $res){
					 $coupan_code[]=$res->code;
				 }
				
				 $result=DB::table('master_coupon')->whereIn('master_coupon.code',$coupan_code)->orderBy('master_coupon.id','DESC')->paginate($request->countval);
				  if(($result))
            {
		
				foreach($result as $res){
					
					 $getoffer=DB::table('offer')->leftjoin('offer_users', 'offer_users.offer_id', '=', 'offer.id')->where('offer_users.user_id',$request->user_id)->where('offer.id', $res->offer_id)->first();
					  if(!empty($getoffer)){
						
					 $getcom=DB::table('company')->where('id', $res->company_id)->first();
					     
					$coupan_arr['offer_title']= $getoffer->offer_title;
					$coupan_arr['offer_description']= $getoffer->offer_description;
					$coupan_arr['offer_terms']= $getoffer->offer_terms;
					$coupan_arr['comp_name']= $getcom->comp_name;
					$coupan_arr['spoc_email']= $getcom->spoc_email;
					$coupan_arr['offer_id']= $res->offer_id;
					$coupan_arr['paid_amount']= $getoffer->paid_amount;
					$coupan_arr['code']= $res->code;
					$coupan_arr['company_id']= $res->company_id;
					 $getres=DB::table('company_coupons')->where('user_id', $request->user_id)->where('code', $res->code)->where('company_id', $res->company_id)->get();
					 if(count($getres)>0){
					$coupan_arr['used']=1;	 
					$coupan_arr['expiry_date']=date('Y-m-d', strtotime($res->expiry_date));	 
					 }else{
					$coupan_arr['used']=0;	 
						$coupan_arr['expiry_date']=date('Y-m-d', strtotime($res->expiry_date));	
					 } 
					  $coupan_obj[]=$coupan_arr;
					 } 
				}
				 
                return response()->json([
									'status' => 1,
									'status_code' => 200,
									'data' => $coupan_obj,
									'message' => 'message data'
								]);
            }else{
                return response()->json([
                    'status'=>0,
                    'status_code'=>203,
                    'message'=>'message not found',
                ]);
            }
		  
			}catch (\Exception $e) {
				//return response()->json("Server down. Please try again later", 500);
				return response()->json($e, 500);
				//return $e;
			}
			}else{
						return response()->json([
							'status' => 0,
							'status_code' => 200,
							'message' => 'Parameter missing'
							]); 
					}
				

		}
		public function updatecompanycoupan(Request $request)
		{
			  if(($request->user_id )&&($request->company_id)){
					 try{
					 $getoffer=DB::table('master_coupon')->where('code', $request->coupon_code)->where('company_id', $request->company_id)->first();	 
				  $result=DB::table('company_coupons')->insertGetId([ 
                        'user_id' =>  $request->user_id,
                        'company_id' =>  $request->company_id,
                        'code' =>  $request->coupon_code,
                        'offer_id' =>  $getoffer->offer_id,
                        'used' =>  '1',
						'created_date' =>Date("Y-m-d h:m:s")
                      
                    ]);
                return response()->json([
									'status' => 1,
									'status_code' => 200,
									'message' => 'Coupon code updated successfully'
								]);
          
			}catch (\Exception $e) {
				return response()->json("Server down. Please try again later", 500);
			}
			}else{
						return response()->json([
							'status' => 0,
							'status_code' => 200,
							'message' => 'Parameter missing'
							]); 
					}
				

		}
		public function getearnamount(Request $request){
            $earnamt=0;
            $pendingamt=0;
            $percentage=0;
            $pay_amount=0;
            $total=0;
            if($request->id ){
                $offerresult=DB::select("select * from  offer_users left join offer on offer.id=offer_users.offer_id where offer_users.user_id=".$request->id."");
                if(isset($offerresult)){
                    foreach($offerresult as $res){
                        $list_codes = explode(',', $res->offer_keycodes);
                        foreach($list_codes as $code){
                            $percent = DB::table('offer_question')->select('keycode_price_percent') -> where('offer_id', $res->offer_id)->where('question_id', $code)->first();
                            if(!empty($percent)){
                                $getanswer=DB::table('user_questionbank_answer')->select('id')
                                ->where('user_id', $request->id)->where('is_interested',1)->where('questionbank_id',$code)->first();            
                                if(!empty($getanswer)){
                                    $percentage += $percent->keycode_price_percent;
                                   // echo "Offer ID: ".($res->offer_id)."".", Percentage: ".$percentage."\n";
                                }
                            }
                        } 
            
                        if($res->data_share == "1"){
                            $total=$res->data_share_price;
                            $pay_amount =$total*$percentage/100;
                           // echo "Offer ID: ".($res->offer_id)."".", Data Pay Amount: ".$pay_amount."\n";
                        }
                    
                        if($res->open_to_contact == "1"){
                            $pay_amount += $res->open_to_contact_price;
                         //   echo "Offer ID: ".($res->offer_id)."".", With Open Pay Amount: ".$pay_amount."\n";
                        }
            
                        if($pay_amount>0){
                            $checktranscation=DB::table('offer_payment')->select('id')
                            ->where('offer_id', $res->offer_id)->where('amount', $pay_amount)->where('payee_id', $request->id)->first();
                            if(!empty($checktranscation)){
                                $earnamt+=$pay_amount;
                            } else{
                                $pendingamt+=$pay_amount;       
                            }
                    
                        }
                        $percentage=0;
                    }
                
                }
                $result=DB::table('marketing_strategy')->where('userid', $request->id)->where('status','=','1')->get();
                
                if(isset($result)){
                    foreach($result as $res){
                        $earnamt+=$res->amount;
                    }
                } 
                $status=['2,3'];
                $result1=DB::select("SELECT userid,amount,type FROM marketing_strategy where userid=".$request->id." and status in(2,3)");
                if(($result1)){
                    foreach($result1 as $res){
                        $pendingamt+=$res->amount;
                    }
                }
                $data['earnamt']=$earnamt;
                $data['pendingamt']=$pendingamt;
                echo "Hello World!\n";
                return response()->json([
                                        'status' => 1,
                                        'status_code' => 200,
                                        'data' => $data,
                                        'message' => 'message data'
                                    ]);
            
            } else{
                return response()->json([
                    'status' => 0,
                    'status_code' => 200,
                    'message' => 'Parameter missing'
                    ]); 
            }
        } 
	/* 	public function getearnamount(Request $request)
		{
            $earnamt=0;
            $pendingamt=0;
            $percentage=0;
           $pay_amount=0;
           $total=0;
			  if($request->id ){
				  $offerresult=DB::select("select * from  offer_users left join offer on offer.id=offer_users.offer_id where offer_users.user_id=".$request->id."");
				if(isset($offerresult)){
					foreach($offerresult as $res){
      
				$list_codes = explode(',', $res->offer_keycodes);
				 foreach($list_codes as $code){
               $percent = DB::table('offer_question')->select('keycode_price_percent') -> where('offer_id', $res->offer_id)->where('question_id', $code)->first();
			  
                   if(!empty($percent)){
			 $getanswer=DB::table('user_questionbank_answer')->select('id')
          ->where('user_id', $request->id)->where('is_interested',1)->where('questionbank_id',$code)->first();		    if(!empty($getanswer)){
                $percentage += $percent->keycode_price_percent;
		  }
                   }
              } 
			
					 if($res->offer_type == "1" || $res->offer_type == "3"){
								$total=$res->data_share_price;
								 $pay_amount =$total*$percentage/100;
								 	
						}
				 
			  if($res->offer_type == "2" || $res->offer_type == "3"){
				  $pay_amount += $res->open_to_contact_price;
			  }
			
			     if($pay_amount>0){
           $checktranscation=DB::table('offer_payment')->select('id')
          ->where('offer_id', $res->offer_id)->where('amount', $pay_amount)->where('payee_id', $request->id)->first();
          if(!empty($checktranscation)){
			  $earnamt+=$pay_amount;
					}else{
				$pendingamt+=$pay_amount;		
					}
					
				}
					}
				
				}
	$result=DB::table('marketing_strategy')->where('userid', $request->id)->where('status','=','1')->get();
               
		 if(isset($result))
            {
				foreach($result as $res){
					$earnamt+=$res->amount;
				}
			} 
			$status=['2,3'];
			$result1=DB::select("SELECT userid,amount,type FROM marketing_strategy where userid=".$request->id." and status in(2,3)");
               
				  if(($result1))
            {
				foreach($result1 as $res){
					$pendingamt+=$res->amount;
				}
				
			}
			$data['earnamt']=$earnamt;
			$data['pendingamt']=$pendingamt;
			 return response()->json([
									'status' => 1,
									'status_code' => 200,
									'data' => $data,
									'message' => 'message data'
								]);
		  
		}else{
						return response()->json([
							'status' => 0,
							'status_code' => 200,
							'message' => 'Parameter missing'
							]); 
					}
				

		}  */
		public function paypaltransactionlist(Request $request)
		{
					 try{
				 //$result=DB::table('transaction_logs')->where('id',$res->to_acc)->get();
				 $result=DB::select("SELECT * FROM transaction_logs where to_acc=".$request->id."");
				 	  if(($result))
            {
				 foreach($result as $res){
					  $getto=DB::table('users')->where('id',$res->to_acc)->first();
					  if(isset($getto)){
					  $res->to=$getto->fname.''.$getto->lname; 
					  }else{
						  $res->to='';
					  }
					  $getfrom=DB::table('users')->where('id',$res->from_acc)->first();
					    if(isset($getfrom)){
					  $res->from=$getfrom->fname.''.$getfrom->lname; 
					  }else{
						  $res->from='';
					  }
				 }
			
                return response()->json([
									'status' => 1,
									'status_code' => 200,
									'data' => $result,
									'message' => 'location data'
								]);
            }else{
                return response()->json([
                    'status'=>0,
                    'status_code'=>203,
                    'message'=>'message not found',
                ]);
            }
		  
			}catch (\Exception $e) {
				return response()->json($e, 500);
			}	

		} public function currentLocation(Request $request)
		{
					 try{
				 $result=DB::table('currentlocation')->get();
               
				  if(($result))
            {
                return response()->json([
									'status' => 1,
									'status_code' => 200,
									'data' => $result,
									'message' => 'location data'
								]);
            }else{
                return response()->json([
                    'status'=>0,
                    'status_code'=>203,
                    'message'=>'message not found',
                ]);
            }
		  
			}catch (\Exception $e) {
				return response()->json("Server down. Please try again later", 500);
			}	

		}  
		  public function acceptOffer(Request $request)
		{

			  if($request->user_id && $request->offer_id){
				  
					 try{
				 $result=DB::table('push_messages')
                ->where('user_id', $request->user_id)
                ->where('offer_id', $request->offer_id)
                ->update([
                    'accept_status'=> $request->status
                ]);
				  if(($result))
            {
                return response()->json([
                    'status'=>1,
                    'status_code'=>200,
                    'message'=>'Offer Accepted successfully',
                ]);
            }else{
                return response()->json([
                    'status'=>0,
                    'status_code'=>203,
                    'message'=>'Offer not Accepted',
                ]);
            }
		  
			}catch (\Exception $e) {
				return response()->json("Server down. Please try again later", 500);
			}
			}else{
						return response()->json([
							'status' => 0,
							'status_code' => 200,
							'message' => 'Parameter missing'
							]); 
					}
				

		}  
		public function createcoupon(Request $request)
		{
            if($request->referemail){
				$checkmail=DB::table('users')
                ->where('email', $request->referemail)->first();
			$referemail=$request->referemail;
				//if(!empty($checkmail)){
			$result=DB::table('coupons')
                ->where('referee_email_id', $request->referemail)->first();
				if(empty($result)){
				
        $company_id = 1;
        $offer_id = $request->offer_id;
        $user_id = $request->user_id;
		$length=7;
        $random_code = substr(str_shuffle(str_repeat($x='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($length/strlen($x)) )),1,8);
        if(isset($company_id)){
            if($user_id != ""){	
					  $result1=DB::table('coupons')->insertGetId([ 
                        'company_id' => $company_id, 
                        'code' => $random_code, 
                        'user_id' => $user_id,
                        'referee_email_id' => $request->referemail,
                        'type' => "2", 
                        'used' => "0", 
                    ]); 
					
					
				$messageData=['random_code'=>$random_code,'firstname'=>$checkmail->fname,'lastname'=>$checkmail->lname];
			     $email_sent = Mail::send('email/coupan_code',$messageData,function($message) use($referemail){
                            $message->to($referemail)->subject('Join Identity Wallet');
                        }); 				
					return response()->json([
							 'status' => 1,
					'status_code' => 200,
                    'message' => "Created referral coupon."
							]); 
				
      
                    		
            } else {
               $result1=DB::table('coupons')->insertGetId([ 
                        'company_id' => $company_id, 
                        'code' => $random_code, 
                        'type' => "1", 
                        'used' => "0", 
						 'referee_email_id' => $request->referemail,
                        'offer_id' => $offer_id
                    ]); 
                return response()->json([
                    "code" => "200",
                    "message" => "Created offer coupon (non-referral)."
                ]);        
            }
        }else{
        return response()-> json([
           	'status' => 3,
			'status_code' => 400,
            "message" => "Missing company id to assign coupon to."
        ]); 
		}
            }else{
				return response()->json([
							'status' => 3,
			                'status_code' => 400,
							'message' => 'Reference Email id already exits'
							]); 
						
					}
	/* 	}else{
				return response()->json([
							'status' => 3,
			                'status_code' => 400,
							'message' => 'Reference Email id Not exits'
							]); 
						
					} */
					
				 }else{
						return response()->json([
							'status' => 0,
							'status_code' => 200,
							'message' => 'Parameter missing'
							]); 
					}
				

		}
		
		 public function getUnanswerQuestion(Request $request){
        
        $user_id = $request->user_id;
        $offer_id = $request->offer_id;
		
		$questionlist = DB::select("select * from offer_question join question_bank on 
 question_bank.id=offer_question.question_id where offer_question.offer_id=$offer_id 
 and question_bank.id NOT IN(SELECT questionbank_id FROM user_questionbank_answer WHERE questionbank_id in 
 (select question_bank.id from offer_question 
 left join question_bank on question_bank.id=offer_question.question_id where offer_question.offer_id=$offer_id) and user_questionbank_answer.is_interested=1 and user_questionbank_answer.user_id=$user_id)order by RAND() LIMIT 1");
	
		 
        if($questionlist){
			$data = array();
			foreach($questionlist as $question){
						$data[0]['keycode_id'] = $question->keycode_id;
						$data[0]['id'] = $question->question_id;
						$data[0]['question'] = $question->question;
						$data[0]['question_mode'] = $question->question_mode;
						$data[0]['is_standard'] = $question->is_standard;
                        $qOptions = DB::table('questions_option')->select('id','keycode_id','option')->where('keycode_id',$question->keycode_id)->get();
                        if(!empty($qOptions)){
                            $data[0]['question_options'] = $qOptions;
                        }else{
                           $data[0]['question_options'] = [];
                        }
			}
			if(!empty($data)){
				  return response()->json([
                'status' => 1,
                'status_code' => 200,
                'message' => 'Question Generated',
                'data' => $data
                ]); 
			}else{
				  return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'No data found',
                'data' => null
                ]);  
			}
               
        }else{
             return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'No data found',
                'data' => null
                ]);  
        }
    }	
	public function getSubcribeOfferList(Request $request){
        
        $user_id = $request->user_id;
         
		 $result = DB::select("SELECT offer.*,company.comp_name,offer_users.offer_keycodes FROM offer_users left join offer on offer.id=offer_users.offer_id left join company on offer.company_id=company.id where offer_users.user_id= $user_id"); 
        if($result){
			foreach($result as $res){
				 $keyid = DB::select("SELECT question_id FROM offer_question where offer_id  = $res->id");
				 if(count($keyid)!=0){
				foreach($keyid as $id){
					$keycodearr[]=$id->question_id;
				}
				 $keycodeobj= implode(",", $keycodearr);
				 $res->keycodeobj=$keycodeobj;
				
				 $res->quescount=count($keyid);
				   $answer = DB::select("SELECT * FROM user_questionbank_answer where questionbank_id in ($keycodeobj) and user_id=$user_id and is_interested=1");
				   unset($keycodearr);
				 if(count($answer)>=count($keyid)){
					 $res->answerd=1;
				 }else{
				  $res->answerd=2;
				 }
				$res->answercount=count($answer);  
				
				}else{
				 $res->keycodeobj='';	
				  $res->quescount=0;
				  $res->answercount=0;
				   $res->answerd=0;
				}
			}
			
                return response()->json([
                                'status' => 0,
                                'status_code' => 201,
                               'message' => 'Categories Listing with user preference.',
                            'data' => $result
                            ]);
        }else{
            return response()->json([
                            'status' => 1,
                            'status_code' => 200,
                            'message' => 'No Categories Existed.',
                                'data' => null 
                        ]);
        }
    }
	
  // Backend service for amount paid in offer subscribers
 
	

	// Change password ::
        public function changePassword(Request $request)
        {   
		
		    if(isset($request->userid)||isset($request->password)){
				$validator = Validator::make($request->all(), [
                'password' => 'required|min:8|regex:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/',
            ]);
        if ($validator->fails()) {
            return response()->json(['status'=>0,'message' => $validator->errors()->first()], 200);
        }
		    $userid=$request->userid;
		    $password=bcrypt($request->password);
            User::where(['password'=>$password])->update([
                'id'=>$request->userid,
            ]);
			
			 return response()->json([
                        'status' => 1,
                        'status_code' => 200,
                        'message' => 'Password Changed Successfully'
                    ]);
             }else{
            return response()->json([
                                'status' => 2,
                                'status_code' => 202,
                                'message' => 'Invalid Input',
                                'data' => null
                            ]);
        }
        }
    // Close
	 
	
	  public function insertransuqto($userid,$offerid,$quesid,$createdby,$amt,$transdate,$tranid,$transaction_type)
        { 
		 foreach($quesid as $code){
 		try{
			
			 $user = User::find($userid);
			$getques=DB::table('question_bank')->select('status')->where('id', $code)->first();
			$getansques=DB::table('user_questionbank_answer')->select('answers_type','is_interested','is_relevant')->where('questionbank_id', $code)->where('user_id', $userid)->first();
			$getoffer=DB::table('offer')->select('data_share_price','offer_title','offer_type','open_to_contact_price','data_share_price','offer_start','offer_end','created_by','offer_mechanism','status')->where('id', $offerid)->first();
			$getofferkeycode=DB::table('offer_question')->select('keycode_price_percent')->where('offer_id',$offerid)->first();
			$getofferuser=DB::table('offer_users')->select('data_share','open_to_contact','terms_conditions')->where('offer_id',$offerid)->where('user_id',$userid)->first();
			$paid_price=$getoffer->data_share_price * $getofferkeycode->keycode_price_percent / 100;
           	$result=DB::table('uqto')->insertGetId([ 
                        'user_id' => $userid,
                        'offer_id' => $offerid,
                        'questionbank_id' => $code,
                        'user_type' => 1,
                        'dob' => $user->dob,
                        'gender' => $user->gender,
                        'marital_status' => $user->marital_status,
                        'yearly_income' => $user->yearly_income,
                        'emp_status' => $user->emp_status,
                        'industry' => $user->industry,
                        'school_attended' => $user->school_attended,
                        'nationality' => $user->mm_nationalities,
                        'country' => $user->country,
                        'city' => $user->city,
                        'latitude' => $user->dob,
                        'longitude' => $user->dob,
                        'answers_type' => $getansques->answers_type,
                        'is_interested' => $getansques->is_interested,
                        'is_relevant' => $getansques->is_relevant,
                        'ques_status' => $getques->status,
                        'is_standard' => 1,
                        'primary_id' => $userid,
                        'local_data_consistency' => '',
                        'global_data_consistency' => '',
                        'offer_title' => $getoffer->offer_title,
                        'offer_type' => $getoffer->offer_type,
                        'open_to_contact_price' => $getoffer->open_to_contact_price,
                        'data_share_price' => $getoffer->data_share_price,
                        'keycode_price_percent' => $getofferkeycode->keycode_price_percent,
                        'paid_price' => $paid_price,
                        'offer_start' => $getoffer->offer_start,
                        'offer_end' =>$getoffer->offer_end,
                        'created_by' => $getoffer->created_by,
                        'status' => $getoffer->status,
                        'offer_mechanism' => $getoffer->offer_mechanism,
                        'data_share' => $getofferuser->data_share,
                        'open_to_contact' => $getofferuser->open_to_contact,
                        'terms_conditions' => $getofferuser->terms_conditions,
                        'consumer' => '',
                        'estimated_spend' => '',
                        'y_pred_class_output' => '',
                        'y_pred_prob_output' => '',
                        'y_pred_regression_output' => '',
                        'y_pred_regression_agg_output' => '',
                        'company_id' => $createdby,
                        'transaction_type' => $transaction_type,
                        'amount' => $amt,
                        'transaction_date' => $transdate,
                        'company_tran_id' => $tranid,
                    ]);
			$result1=DB::table('transaction_logs')->insertGetId([ 
                        'offer_id' => $offerid,
                        'from_acc' => $createdby,
                        'to_acc' => $userid,
                        'transaction_type' => $transaction_type,
                        'amount' => $amt,
                        'transaction_id' => $tranid,
                    ]); 
					//print_r($result);
     } catch (\Exception $e) {
				print_r($e);
               
            }  
		
            }
        }
    // Close
	
    public function notification($token,$title,$message,$offerid)
		{
	 define('API_ACCESS_KEY','AAAAQzwz1Ns:APA91bElRlZYgYMVD7uysJVuH0szueLgH3BJBuw8DIjJiD0FQJIVtclj-b033EcgiEcKedmxaJttVwbs8lm5Vi4hsrUXNHx_l3jWH7fgU0Rwom7bU2-0xTzBFQKX67v0RcaE5-ISeJ83');
 $fcmUrl = 'https://fcm.googleapis.com/fcm/send';
     $notification = [
            'title' =>$title,
            'body' => $message,
            'icon' =>'myIcon', 
            'sound' => 'mySound'
        ];
        $extraNotificationData = ["offerId" =>$offerid];

        $fcmNotification = [
            //'registration_ids' => $tokenList, //multple token array
            'to'        => $token, //single token
            'notification' => $notification,
            'data' => $extraNotificationData,
			
        ];
        $headers = [
            'Authorization: key=' . API_ACCESS_KEY,
            'Content-Type: application/json'
        ];
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,$fcmUrl);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fcmNotification));
        $result = curl_exec($ch);
        curl_close($ch); 
         }		
	
		public function distance($lat1, $lon1, $lat2, $lon2, $unit) 
	{
	  if (($lat1 == $lat2) && ($lon1 == $lon2)) {
		return 0;
	  }
	  else {
		$theta = $lon1 - $lon2;
		$dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
		$dist = acos($dist);
		$dist = rad2deg($dist);
		$miles = $dist * 60 * 1.1515;
		$unit = strtoupper($unit);

		if ($unit == "K") {
		  return ($miles * 1.609344);
		} else if ($unit == "N") {
		  return ($miles * 0.8684);
		} else {
		  return $miles;
		}
	  }
	} 
	
		function curl_request($url, $method, $headers = [], $data = [], $curl_options = []){

    $curl = curl_init();

    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_TIMEOUT, 0);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);

    //--- If any headers set add them to curl request
    if(!empty($headers)){
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);
    }

    //--- Set the request type , GET, POST, PUT or DELETE
    switch($method){
        case "POST":
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "POST");
        break;
    case "PUT":
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
        break;
    case "DELETE":
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "DELETE");
        break;
    default:
        curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "GET");
        break;
    }

    //--- If any data is supposed to be send along with request add it to curl request
    if($data){
        curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
    }
    //--- Any extra curl options to add in curl object
    if($curl_options){
        foreach($curl_options as $option_key => $option_value){
            curl_setopt($curl, $option_key, $option_value);
        }
    }

    $response = curl_exec($curl);
    $error = curl_error($curl);
    curl_close($curl);

    //--- If curl request returned any error return the error
    if ($error) {
        return "CURL Error: $error";
    }
    //--- Return response received from call
    return $response;
}

 	public function deleteUser(Request $request)
    {
        if($request->user_id){
          DB::table('users')->where('id', '=', $request->user_id)->delete(); 
		  
		   return response()->json([
                'status' => 1,
                'status_code' => 200,
                'message' => 'User Deleted Successfully'
                ]);
    
        }else{
            return response()->json([
                'status' => 0,
                'status_code' => 200,
                'message' => 'User id missing!'
                ]);
        }    
       
    }
}