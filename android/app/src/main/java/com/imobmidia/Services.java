package com.imobmidia;

import retrofit2.Call;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.POST;

/**
 * Created by ejcomp on 09/12/17.
 */

public interface Services {

    public static final String URL_BASE = "http://200.145.184.146/hackathon/api/";


    @FormUrlEncoded
    @POST("get_id_pagina/")
    Call<String> getIdPagina(

            @Field("email") String email

    );

    @FormUrlEncoded
    @POST("get_template/")
    Call<String> getTemplate(

            @Field("email") String email

    );


    @FormUrlEncoded
    @POST("login/")
    Call<Boolean> login(

            @Field("email") String email

    );

    @FormUrlEncoded
    @POST("save_publicacao/")
    Call<Boolean> savePublicacao(

            @Field("email") String email,
            @Field("name") String name,
            @Field("id_pagina") String id_pagina
    );

}
